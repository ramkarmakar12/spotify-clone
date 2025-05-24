import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Music } from 'lucide-react';

const Login: React.FC = () => {
  const { login, isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-spotify-black via-spotify-dark to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-spotify-green p-4 rounded-full">
              <Music className="h-12 w-12 text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-white mb-2">
            Welcome to Spotify Clone
          </h2>
          <p className="text-spotify-lightgray text-lg">
            Connect your Spotify account to get started
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="bg-spotify-dark/50 backdrop-blur-sm rounded-lg p-8 border border-gray-800">
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Sign in with Spotify
                </h3>
                <p className="text-spotify-gray text-sm mb-6">
                  You'll be redirected to Spotify to authorize this application
                </p>
              </div>

              <button
                onClick={login}
                disabled={isLoading}
                className="w-full bg-spotify-green hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-full transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Music className="h-5 w-5" />
                    <span>Connect with Spotify</span>
                  </>
                )}
              </button>

              <div className="text-xs text-spotify-gray text-center mt-4">
                <p>By connecting, you agree to allow this app to:</p>
                <ul className="mt-2 space-y-1">
                  <li>• View your Spotify profile</li>
                  <li>• Access your playlists</li>
                  <li>• View your top tracks and artists</li>
                  <li>• Access your saved music</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-spotify-gray text-sm">
              Don't have a Spotify account?{' '}
              <a
                href="https://www.spotify.com/signup"
                target="_blank"
                rel="noopener noreferrer"
                className="text-spotify-green hover:text-green-400 transition-colors"
              >
                Sign up here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;