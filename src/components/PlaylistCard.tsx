import React from 'react';
import type { SpotifyPlaylist } from '../services/spotifyApi';
import { Play, Music } from 'lucide-react';

interface PlaylistCardProps {
  playlist: SpotifyPlaylist;
  onClick?: () => void;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist, onClick }) => {
  const imageUrl = playlist.images?.[0]?.url;

  return (
    <div 
      className="bg-spotify-dark/40 hover:bg-spotify-dark/60 rounded-lg p-4 transition-all duration-300 cursor-pointer group"
      onClick={onClick}
    >
      <div className="relative mb-4">
        <div className="aspect-square rounded-lg overflow-hidden bg-gray-800 flex items-center justify-center">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={playlist.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Music className="h-12 w-12 text-spotify-gray" />
          )}
        </div>
        <div className="absolute bottom-2 right-2 bg-spotify-green rounded-full p-3 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
          <Play className="h-4 w-4 text-black fill-current" />
        </div>
      </div>
      
      <div className="space-y-1">
        <h3 className="font-semibold text-white truncate text-sm">
          {playlist.name}
        </h3>
        <p className="text-spotify-gray text-xs truncate">
          {playlist.description || `By ${playlist.owner.display_name}`}
        </p>
        <p className="text-spotify-gray text-xs">
          {playlist.tracks.total} tracks
        </p>
      </div>
    </div>
  );
};

export default PlaylistCard;