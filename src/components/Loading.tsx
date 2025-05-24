import React from 'react';
import { Music } from 'lucide-react';

interface LoadingProps {
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="bg-spotify-green p-3 rounded-full mb-4">
        <Music className="h-8 w-8 text-white animate-pulse" />
      </div>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-spotify-green mb-4"></div>
      <p className="text-spotify-lightgray text-sm">{message}</p>
    </div>
  );
};

export default Loading;