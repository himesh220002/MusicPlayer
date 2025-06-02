// MusicPlayer.js

import React, { useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import './Mplayer.css';
import newSong from './newPlaylist.js';
import Lyrics from './Lyrics.js';
import { FaVolumeHigh } from "react-icons/fa6";

const MusicPlayer = () => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [randomPlay, setRandomPlay] = useState(false);
  const [progress, setProgress] = useState(0);
  const [newSongs, setNewSongs] = useState([]);

  const getStoredPlaylist = () => {
    const storedPlaylist = localStorage.getItem('playlist');
    return storedPlaylist ? JSON.parse(storedPlaylist) : [];
  };

  const [originalPlaylist, setOriginalPlaylist] = useState(newSong);
  const [playlist, setPlaylist] = useState(originalPlaylist);

  const playerRef = useRef(null);

  const playPauseToggle = () => setPlaying((prev) => !prev);
  const handleVolumeChange = (vol) => setVolume(vol);
  const handleProgress = (prog) => setProgress(prog.played);
  const handleProgressBarClick = (e) => {
    const clickX = e.clientX - e.target.getBoundingClientRect().left;
    const width = e.target.offsetWidth;
    const percent = clickX / width;
    setProgress(percent);
    playerRef.current.seekTo(percent, 'fraction');
  };

  const handleEnded = () => playNextSong();
  const toggleRandomPlay = () => setRandomPlay((prev) => !prev);

  const handleSearch = (term) => {
    const filtered = originalPlaylist.filter((song) =>
      song.title.toLowerCase().includes(term.toLowerCase())
    );
    setPlaylist(term.trim() === '' ? originalPlaylist : filtered);
  };

  const handleClick = (index) => {
    setCurrentSongIndex(index);
    setPlaying(true);
  };

  const playNextSong = () => {
    if (randomPlay) {
      let idx;
      do {
        idx = Math.floor(Math.random() * playlist.length);
      } while (idx === currentSongIndex);
      setCurrentSongIndex(idx);
    } else {
      setCurrentSongIndex((prev) => (prev + 1) % playlist.length);
    }
  };

  const playPreviousSong = () => {
    if (randomPlay) {
      let idx;
      do {
        idx = Math.floor(Math.random() * playlist.length);
      } while (idx === currentSongIndex);
      setCurrentSongIndex(idx);
    } else {
      setCurrentSongIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
    }
  };

  const handleFileChange = (e) => {
    setNewSongs([...newSongs, ...e.target.files]);
  };

  const handleAddSongs = () => {
    const added = newSongs.map(file => ({
      title: file.name.replace(/\.[^/.]+$/, ''),
      url: URL.createObjectURL(file),
    }));
    setPlaylist([...playlist, ...added]);
    setNewSongs([]);
  };

  return (
    <div className='music'>
      <div className='cover-container '>
        <div className='playing '>
          <p id='currentsong'><strong>🏴‍☠️ Treasure playing: </strong><i>{playlist[currentSongIndex].title}</i></p>
          <div className='playnav'>
            <div id="playcontrol">
              <button id='prev' onClick={playPreviousSong}><img src='./images/previous.png' alt='Previous' /></button>
              <button id='play' onClick={playPauseToggle}>
                {playing ? <img src='./images/pause-button.png' alt='Pause' /> : <img src='./images/play.png' alt='Play' />}
              </button>
              <button id='next' onClick={playNextSong}><img src='./images/next.png' alt='Next' /></button>
              <button id='random' onClick={toggleRandomPlay}>
                <img src='./images/shuffle (1).png' alt='shuffle' style={{ filter: randomPlay ? 'contrast(250%)' : 'none' }} />
              </button>
            </div>
            <div className='vol-search'>
              <i>< FaVolumeHigh /></i>
              <input
                id='vol'
                type='range'
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              />
            </div>
          </div>
        </div>

        <div className='covrimg'>
          <img
            src={playlist[currentSongIndex].coverImage || '/images/cover.webp'}
            alt='Album Cover'
            className='cover-image'
          />
        </div>
      </div>

      <div className='progsetting'>
        <div id='progress-bar'>
          <progress value={progress} max={1} onClick={handleProgressBarClick}></progress>
        </div>

        <div className='react-player-container'>
          <ReactPlayer
            ref={playerRef}
            url={playlist[currentSongIndex].url}
            playing={playing}
            volume={volume}
            onEnded={handleEnded}
            onProgress={handleProgress}
            controls
            className='react-player'
          />
        </div>
      </div>

      <div id='playlist custom-scroll'>
        <div className='pirateplay'>
          <h2>⚓ Pirate Playlist</h2>
          <div className='search-file'>
            <input
              type='file'
              accept='audio/*'
              multiple
              onChange={handleFileChange}
            />
            <button onClick={handleAddSongs}><img src='./images/add.png' style={{ width: '30px', height: '30px' }} alt='add' /></button>
          </div>
        </div>

        <div className='listLyric'>
          <div className='songlist custom-scroll'>
            <ul>
              {playlist.map((song, index) => (
                <li
                  key={index}
                  onClick={() => handleClick(index)}
                  className={index === currentSongIndex ? 'playing-song' : ''}
                >
                  <div style={{ display: 'flex' }}>
                    <span>🎶</span>&nbsp;<span>{song.title}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className='lyrics-container custom-scroll'>
            <Lyrics songTitle={playlist[currentSongIndex].title} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
