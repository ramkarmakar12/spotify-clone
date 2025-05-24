import React from 'react';
import type{ SpotifyTrack } from '../services/spotifyApi';
import { Play, Music, ExternalLink } from 'lucide-react';

interface TrackCardProps {
  track: SpotifyTrack;
  index?: number;
}

const TrackCard: React.FC<TrackCardProps> = ({ track, index }) => {
  const imageUrl = track.album.images?.[0]?.url;
  const artists = track.artists.map(artist => artist.name).join(', ');
  const duration = Math.floor(track.duration_ms / 60000) + ':' + 
    Math.floor((track.duration_ms % 60000) / 1000).toString().padStart(2, '0');

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (track.preview_url) {
      // In a real app, you'd integrate with Spotify's Web Playback SDK
      window.open(track.preview_url, '_blank');
    } else {
      window.open(track.external_urls.spotify, '_blank');
    }
  };

  const handleTrackClick = () => {
    window.open(track.external_urls.spotify, '_blank');
  };

  return (
    <div className="flex items-center space-x-4 p-3 rounded-lg hover:bg-spotify-dark/40 transition-colors group cursor-pointer"
         onClick={handleTrackClick}>
      {index !== undefined && (
        <div className="w-4 text-spotify-gray text-sm font-medium">
          {index + 1}
        </div>
      )}
      
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 rounded overflow-hidden bg-gray-800 flex items-center justify-center">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={track.album.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Music className="h-6 w-6 text-spotify-gray" />
          )}
        </div>
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={handlePlayClick}
            className="bg-spotify-green rounded-full p-1.5 hover:scale-110 transition-transform"
          >
            <Play className="h-3 w-3 text-black fill-current" />
          </button>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-white truncate text-sm">
          {track.name}
        </h4>
        <p className="text-spotify-gray text-xs truncate">
          {artists}
        </p>
      </div>

      <div className="hidden md:block flex-1 min-w-0">
        <p className="text-spotify-gray text-xs truncate">
          {track.album.name}
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-spotify-gray text-xs">
          {duration}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            window.open(track.external_urls.spotify, '_blank');
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-spotify-dark rounded"
        >
          <ExternalLink className="h-4 w-4 text-spotify-gray hover:text-white" />
        </button>
      </div>
    </div>
  );
};

export default TrackCard;