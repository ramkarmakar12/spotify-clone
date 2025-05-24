# Spotify Clone

A simplified clone of Spotify's homepage built with React, TypeScript, and Tailwind CSS that displays a logged-in user's favorite playlists and tracks using the official Spotify Web API.

## Features

- **User Authentication**: Spotify OAuth2 login integration
- **Dashboard**: Clean, responsive interface displaying:
  - User's playlists
  - Top tracks (based on listening history)
  - Liked/saved songs
- **Responsive Design**: Mobile-friendly interface
- **Real-time Data**: Fetches live data from Spotify Web API
- **Modern UI**: Spotify-inspired design with smooth animations

## Tech Stack

- **Frontend**: React 19 with TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Build Tool**: Vite
- **API**: Spotify Web API

## Prerequisites

Before running this application, you need:

1. **Node.js** (version 16 or higher)
2. **npm** or **yarn**
3. **Spotify Developer Account** and registered application

## Spotify App Setup

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Note down your `Client ID`
4. Add `http://localhost:5173/callback` to your app's Redirect URIs
5. Save the settings

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd spotify-clone
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Spotify credentials:
   ```env
   VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id_here
   VITE_SPOTIFY_REDIRECT_URI=http://localhost:5173/callback
   VITE_SPOTIFY_SCOPES=user-read-private user-read-email playlist-read-private user-top-read user-library-read
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## Usage

1. **Login**: Click "Connect with Spotify" to authenticate
2. **Authorization**: You'll be redirected to Spotify to authorize the app
3. **Dashboard**: After successful login, you'll see:
   - Your playlists in a grid layout
   - Your top tracks from recent listening
   - Your liked/saved songs
4. **Navigation**: Use the tabs to switch between different views
5. **Interaction**: Click on playlists or tracks to open them in Spotify

## Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard.tsx    # Main dashboard component
│   ├── Login.tsx        # Login page
│   ├── Callback.tsx     # OAuth callback handler
│   ├── PlaylistCard.tsx # Playlist display component
│   ├── TrackCard.tsx    # Track display component
│   └── Loading.tsx      # Loading component
├── contexts/            # React contexts
│   └── AuthContext.tsx  # Authentication state management
├── services/            # API services
│   └── spotifyApi.ts    # Spotify API integration
├── App.tsx             # Main app component with routing
├── main.tsx            # App entry point
└── index.css           # Global styles with Tailwind
```

## API Integration

The app integrates with these Spotify Web API endpoints:

- `/me` - Get current user profile
- `/me/playlists` - Get user's playlists
- `/me/top/tracks` - Get user's top tracks
- `/me/tracks` - Get user's saved tracks

## Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Set Environment Variables**
   In your Vercel dashboard, add the environment variables from your `.env` file

4. **Update Redirect URI**
   In your Spotify app settings, add your Vercel domain to Redirect URIs:
   ```
   https://your-app.vercel.app/callback
   ```

### Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to Netlify

3. **Set Environment Variables** in Netlify dashboard

4. **Update Redirect URI** in Spotify app settings

## Environment Variables

| Variable | Description | Example |
|----------|-------------|----------|
| `VITE_SPOTIFY_CLIENT_ID` | Your Spotify app's Client ID | `abc123def456` |
| `VITE_SPOTIFY_REDIRECT_URI` | OAuth redirect URI | `http://localhost:5173/callback` |
| `VITE_SPOTIFY_SCOPES` | Required Spotify permissions | `user-read-private user-read-email...` |

## Troubleshooting

### Common Issues

1. **"Invalid client" error**
   - Check your Client ID in `.env`
   - Ensure your Spotify app is not in Development Mode for production

2. **"Invalid redirect URI" error**
   - Verify the redirect URI in your Spotify app settings
   - Ensure it matches exactly (including protocol and port)

3. **"Insufficient scope" error**
   - Check that all required scopes are included in `VITE_SPOTIFY_SCOPES`

4. **Build errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check that Node.js version is 16 or higher

## Limitations

- **Playback**: This is a display-only clone. Actual music playback requires Spotify Premium and additional SDK integration
- **Rate Limits**: Spotify API has rate limits; excessive requests may be throttled
- **Scope**: Limited to read-only operations for security

## Future Enhancements

- [ ] Music playback with Spotify Web Playback SDK
- [ ] Search functionality
- [ ] Playlist creation and management
- [ ] Recently played tracks
- [ ] Artist and album pages
- [ ] Social features (following, sharing)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is for educational purposes only. Spotify is a trademark of Spotify AB.

## Support

If you encounter any issues:

1. Check the troubleshooting section
2. Verify your Spotify app configuration
3. Ensure all environment variables are set correctly
4. Check the browser console for error messages

For additional help, please open an issue in the repository.
