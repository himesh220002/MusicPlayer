// server.js
import express from 'express';
import https from 'https';
import fs from 'fs';
import cors from 'cors';
import dotenv from 'dotenv';
import spotifyRoutes from './src/api/token.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', spotifyRoutes);  // ✅ mounts /api/search

app.get('/', (req, res) => {
  res.send('🎵 Spotify Server Running');
});

app.get('/callback', (req, res) => {
  res.send('✅ Spotify redirect success. You can now close this window.');
});

// Load SSL certificates
const sslOptions = {
  key: fs.readFileSync('./server.key'),
  cert: fs.readFileSync('./server.cert'),
};

const PORT = process.env.PORT || 5000;
https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`✅ Server running at https://localhost:${PORT}`);
});
