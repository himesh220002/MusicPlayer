
// // // utils/spotifyRapid.js
// // // process.env.SPOTIFY_RAPID_API_KEY

// // const [music, setMusic] = 


// // ✅ utils/spotifyRapid.js
// export const searchFromRapid = async (query) => {
//   const url = `https://spotify23.p.rapidapi.com/search/?q=${encodeURIComponent(query)}&type=multi&offset=0&limit=100&numberOfTopResults=20`;

//   const options = {
//     method: 'GET',
//     headers: {
//       'x-rapidapi-key': process.env.SPOTIFY_RAPID_API_KEY,
//       'x-rapidapi-host': 'spotify23.p.rapidapi.com'
//     }
//   };

//   try {
//     const response = await fetch(url, options);
//     const result = await response.json();
//     return {
//       tracks: result?.tracks?.items || [],
//       artists: result?.artists?.items || [],
//       genres: result?.genres?.items || [],
//       playlists: result?.playlists?.items || [],
//       users: result?.users?.items || []
//     };
//   } catch (error) {
//     console.error('Spotify API error:', error);
//     return {};
//   }
// };
