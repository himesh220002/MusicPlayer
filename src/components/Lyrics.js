// Lyrics.js

import React from 'react';
import lyricsData from './lyricsData';
import './Mplayer.css';

const Lyrics = ({ songTitle }) => {
  const lyrics = lyricsData[songTitle] || 'Lyrics not available';

  return (
    <div className='lyrics-container'>
      <pre>{lyrics}</pre>
    </div>
  );
};

export default Lyrics;
