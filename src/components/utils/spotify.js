// src/utils/spotify.js
import axios from 'axios';

// let accessToken = '';

// export const getAccessToken = async () => {
//   if (accessToken) return accessToken;

//   const response = await axios.get('http://localhost:5000/api/token');  
//   accessToken = response.data.access_token;
//   return accessToken;
// };

// 👇 Main track search — only one call now!
export const searchTrack = async (query) => {
  const response = await axios.get('https://localhost:5000/api/search', {
    params: { song: query },
  });

  return response.data; // already returns title, artist, album, etc.
};

// export const searchTrack = async (query) => {
//   const token = await getAccessToken();

//   const response = await axios.get(
//     `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );

//   return response.data.tracks.items[0];
// };
