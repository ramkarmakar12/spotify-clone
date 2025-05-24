import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { spotifyApi, SpotifyPlaylist, SpotifyTrack } from '../services/spotifyApi';
import PlaylistCard from './PlaylistCard';
import TrackCard from './TrackCard';
import Loading from './Loading';
import { LogOut, User, Clock, TrendingUp, Heart } from 'lucide-react';

type TabType = 'playlists' | 'top-tracks' | 'saved-tracks';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('playlists');
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>([]);
  const [savedTracks, setSavedTracks] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [playlistsData, topTracksData, savedTracksData] = await Promise.all([
          spotifyApi.getUserPlaylists(20),
          spotifyApi.getUserTopTracks(20),
          spotifyApi.getUserSavedTracks(20)
        ]);

        setPlaylists(playlistsData.items);
        setTopTracks(topTracksData.items);
        setSavedTracks(savedTracksData.items.map(item => item.track));
      } catch (err: any) {
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const tabs = [
    { id: 'playlists' as TabType, label: 'Your Playlists', icon: User, count: playlists.length },
    { id: 'top-tracks' as TabType, label: 'Top Tracks', icon: TrendingUp, count: topTracks.length },
    { id: 'saved-tracks' as TabType, label: 'Liked Songs', icon: Heart, count: savedTracks.length },
  ];

  const renderContent = () => {
    if (loading) {
      return <Loading message="Loading your music..." />;
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">
            <Clock className="h-12 w-12 mx-auto mb-2" />
            <p className="text-lg font-semibold">Oops! Something went wrong</p>
          </div>
          <p className="text-spotify-gray mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-spotify-green hover:bg-green-600 text-white px-6 py-2 rounded-full transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case 'playlists':
        return (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {playlists.map((playlist) => (
              <PlaylistCard
                key={playlist.id}
                playlist={playlist}
                onClick={() => window.open(`https://open.spotify.com/playlist/${playlist.id}`, '_blank')}
              />
            ))}
          </div>
        );
      
      case 'top-tracks':
        return (
          <div className="space-y-1">
            {topTracks.map((track, index) => (
              <TrackCard key={track.id} track={track} index={index} />
            ))}
          </div>
        );
      
      case 'saved-tracks':
        return (
          <div className="space-y-1">
            {savedTracks.map((track, index) => (
              <TrackCard key={track.id} track={track} index={index} />
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-spotify-black via-spotify-dark to-gray-900">
      {/* Header */}
      <header className="bg-spotify-black/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-spotify-green p-2 rounded-full">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Spotify Clone</h1>
                <p className="text-spotify-gray text-sm">Welcome back, {user?.display_name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2">
                {user?.images?.[0]?.url && (
                  <img
                    src={user.images[0].url}
                    alt={user.display_name}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span className="text-white text-sm font-medium">{user?.display_name}</span>
              </div>
              <button
                onClick={logout}
                className="bg-spotify-dark hover:bg-gray-700 text-white p-2 rounded-full transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-800">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-spotify-green text-spotify-green'
                        : 'border-transparent text-spotify-gray hover:text-white hover:border-gray-600'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                    <span className="bg-spotify-dark text-spotify-lightgray text-xs px-2 py-1 rounded-full">
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="bg-spotify-dark/20 rounded-lg p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;