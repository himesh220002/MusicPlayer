// // src/api/token.js
// import express from 'express';
// import axios from 'axios';
// import qs from 'qs';
// import dotenv from 'dotenv';

// dotenv.config();
// const router = express.Router();

// let cachedToken = null;
// let tokenExpiration = null;

// // ✅ Get fresh Spotify token
// async function getSpotifyToken() {
//   if (cachedToken && Date.now() < tokenExpiration) return cachedToken;

//   const response = await axios.post(
//     'https://accounts.spotify.com/api/token',
//     qs.stringify({ grant_type: 'client_credentials' }),
//     {
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//         Authorization: `Basic ${Buffer.from(
//           `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
//         ).toString('base64')}`,
//       },
//     }
//   );

//   cachedToken = response.data.access_token;
//   tokenExpiration = Date.now() + response.data.expires_in * 1000;
//   return cachedToken;
// }

// // ✅ Main Route: /api/search?song=numb
// router.get('/search', async (req, res) => {
//   const { song } = req.query;
//   if (!song) return res.status(400).json({ error: 'Song query is required' });

//   try {
//     const token = await getSpotifyToken();
//     const searchRes = await axios.get(
//       `https://api.spotify.com/v1/search?q=${encodeURIComponent(song)}&type=track&limit=1`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     const track = searchRes.data.tracks.items[0];
//     if (!track) return res.status(404).json({ error: 'No track found' });

//     res.json({
//       name: track.name,
//       artist: track.artists.map(a => a.name).join(', '),
//       album: track.album.name,
//       previewUrl: track.preview_url,
//       albumArt: track.album.images[0]?.url || null,
//     });
//   } catch (err) {
//     res.status(500).json({ error: 'Search failed', details: err.message });
//   }
// });

// export default router;
