import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Music } from 'lucide-react';

const Callback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleCallback, isAuthenticated } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [authInProgress, setAuthInProgress] = useState<boolean>(true);

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      console.error('Authentication failed:', error);
      setError('Authentication was cancelled or failed');
      setTimeout(() => navigate('/'), 3000);
      return;
    }

    if (!code) {
      console.error('No authorization code received.');
      setError('No authorization code received');
      setTimeout(() => navigate('/login'), 3000);
      return;
    }

    const process = async () => {
      try {
        console.log('Processing code:', code);
        await handleCallback(code);
        setAuthInProgress(false); // done calling callback
      } catch (err) {
        console.error('Error in handleCallback:', err);
        setError('Failed to authenticate with Spotify');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    process();
  }, [searchParams, handleCallback, navigate]);

  useEffect(() => {
    if (!authInProgress && isAuthenticated) {
      console.log('Authentication successful, redirecting to home.');
      navigate('/');
    }
  }, [authInProgress, isAuthenticated, navigate]);

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
