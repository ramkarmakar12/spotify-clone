import axios from 'axios';

const SPOTIFY_BASE_URL = 'https://api.spotify.com/v1';
const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';

const CLIENT_ID = "191ddc3b144d4da39312b3ced8a02285";
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
// const VITE_SPOTIFY_CLIENT_SECRET="f69b470d03534b7586ce524e65ff4600";
const SCOPES = "user-read-private user-read-email playlist-read-private user-top-read user-library-read";



export interface SpotifyUser {
  id: string;
  display_name: string;
  email: string;
  images: Array<{ url: string; height: number; width: number }>;
  followers: { total: number };
  country: string;
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  images: Array<{ url: string; height: number; width: number }>;
  tracks: { total: number };
  owner: { display_name: string };
  public: boolean;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string; id: string }>;
  album: {
    name: string;
    images: Array<{ url: string; height: number; width: number }>;
  };
  duration_ms: number;
  preview_url: string | null;
  external_urls: { spotify: string };
}

class SpotifyAPI {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    this.accessToken = localStorage.getItem('spotify_access_token');
    this.refreshToken = localStorage.getItem('spotify_refresh_token');
  }

  // Generate authorization URL
  getAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      response_type: 'code',
      redirect_uri: REDIRECT_URI,
      scope: SCOPES,
      show_dialog: 'true'
    });
    console.log(REDIRECT_URI);
    return `${SPOTIFY_AUTH_URL}?${params.toString()}`;
  }

  // Exchange authorization code for access token
  async exchangeCodeForToken(code: string): Promise<void> {
    try {
      const response = await axios.post(SPOTIFY_TOKEN_URL, 
        new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: REDIRECT_URI,
          client_id: CLIENT_ID,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const { access_token, refresh_token } = response.data;
      this.accessToken = access_token;
      this.refreshToken = refresh_token;

      localStorage.setItem('spotify_access_token', access_token);
      if (refresh_token) {
        localStorage.setItem('spotify_refresh_token', refresh_token);
      }
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      throw error;
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  // Logout user
  logout(): void {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_refresh_token');
  }

  // Make authenticated API request
  private async makeRequest<T>(endpoint: string): Promise<T> {
    if (!this.accessToken) {
      throw new Error('No access token available');
    }

    try {
      const response = await axios.get(`${SPOTIFY_BASE_URL}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        // Token expired, logout user
        this.logout();
        throw new Error('Authentication expired');
      }
      throw error;
    }
  }

  // Get current user profile
  async getCurrentUser(): Promise<SpotifyUser> {
    return this.makeRequest<SpotifyUser>('/me');
  }

  // Get user's playlists
  async getUserPlaylists(limit: number = 20): Promise<{ items: SpotifyPlaylist[] }> {
    return this.makeRequest<{ items: SpotifyPlaylist[] }>(`/me/playlists?limit=${limit}`);
  }

  // Get user's top tracks
  async getUserTopTracks(limit: number = 20, timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term'): Promise<{ items: SpotifyTrack[] }> {
    return this.makeRequest<{ items: SpotifyTrack[] }>(`/me/top/tracks?limit=${limit}&time_range=${timeRange}`);
  }

  // Get user's saved tracks
  async getUserSavedTracks(limit: number = 20): Promise<{ items: Array<{ track: SpotifyTrack }> }> {
    return this.makeRequest<{ items: Array<{ track: SpotifyTrack }> }>(`/me/tracks?limit=${limit}`);
  }

  // Get playlist tracks
  async getPlaylistTracks(playlistId: string, limit: number = 50): Promise<{ items: Array<{ track: SpotifyTrack }> }> {
    return this.makeRequest<{ items: Array<{ track: SpotifyTrack }> }>(`/playlists/${playlistId}/tracks?limit=${limit}`);
  }
}

export const spotifyApi = new SpotifyAPI();
// No-op change to trigger rebuild