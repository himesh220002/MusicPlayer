import React from 'react';
import lyricsData from './lyricsData.js';
import './Mplayer.css';

const Lyrics = ({ songTitle }) => {
  const lyrics = lyricsData[songTitle];
  if (!lyrics) return null;

  return (
    <div className='lyrics-container custom-scroll'>
      <pre>{lyrics}</pre>
    </div>
  );
};

export default Lyrics;
