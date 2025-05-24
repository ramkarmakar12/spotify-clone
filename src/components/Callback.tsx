import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Music } from 'lucide-react';

const Callback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleCallback, isAuthenticated } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (error) {
        console.log('Authentication cancelled or failed:', error);
        setError('Authentication was cancelled or failed');
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      if (code) {
        try {
          console.log('Processing callback with code:', code);
          await handleCallback(code);
          console.log('handleCallback completed.');

          // Wait for authentication state to be updated
          console.log('Starting interval to check isAuthenticated...');
          const checkAuth = setInterval(() => {
            console.log('Checking isAuthenticated:', isAuthenticated);
            if (isAuthenticated) {
              console.log('isAuthenticated is true. Clearing interval and navigating to /');
              clearInterval(checkAuth);
              navigate('/');
            }
          }, 500);
          
          // Cleanup interval after 10 seconds to prevent infinite checking
          console.log('Setting timeout for interval cleanup...');
          const timeoutId = setTimeout(() => {
            console.log('Timeout reached.');
            clearInterval(checkAuth);
            if (!isAuthenticated) {
              console.log('isAuthenticated is still false after timeout. Navigating to /login');
              setError('Authentication timeout');
              navigate('/login');
            }
          }, 10000);

          // Clean up interval and timeout on component unmount or dependency change
          return () => {
            console.log('Cleaning up interval and timeout.');
            clearInterval(checkAuth);
            clearTimeout(timeoutId);
          };

        } catch (err) {
          console.error('Authentication failed:', err);
          setError('Failed to authenticate with Spotify');
          setTimeout(() => navigate('/login'), 3000);
        }
      } else {
        console.log('No authorization code received.');
        setError('No authorization code received');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    processCallback();
  }, [searchParams, handleCallback, navigate, isAuthenticated]);

  if (error) {
    return (
      <div className="min-h-screen bg-spotify-black flex items-center justify-center px-4">
        <div className="text-center">
          <div className="bg-red-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Music className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Authentication Failed</h2>
          <p className="text-spotify-lightgray mb-4">{error}</p>
          <p className="text-spotify-gray text-sm">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-spotify-black flex items-center justify-center px-4">
      <div className="text-center">
        <div className="bg-spotify-green p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <Music className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Authenticating...</h2>
        <p className="text-spotify-lightgray">Please wait while we connect to Spotify</p>
      </div>
    </div>
  );
};

export default Callback;