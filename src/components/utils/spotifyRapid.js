
// // utils/spotifyRapid.js
// // process.env.SPOTIFY_RAPID_API_KEY

// const [music, setMusic] = 


// export const searchFromRapid = async (query) => {
//   const url = 'https://spotify23.p.rapidapi.com/search/?type=multi&offset=0&limit=10&numberOfTopResults=5';

//   const options = {
//     method: 'GET',
//     headers: {
//       'x-rapidapi-key': 'YOUR_KEY',
//       'x-rapidapi-host': 'spotify23.p.rapidapi.com'
//     }
//   };

//   try {
//     const response = await fetch(url, options);
//     const data = await response.json();

//     const tracks = data.tracks?.items || [];

//     return tracks
//       .filter(item => item.data?.previewUrl)
//       .map((item) => ({
//         title: item.data.name,
//         singer: item.data.artists.items.map(artist => artist.profile.name).join(', '),
//         url: item.data.previewUrl,
//         coverImage: item.data.albumOfTrack.coverArt.sources[0].url
//       }));
//   } catch (err) {
//     console.error('RapidAPI error:', err);
//     return [];
//   }
// };
