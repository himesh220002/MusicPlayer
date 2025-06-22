// MusicPlayer.js

import React, { useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import './Mplayer.css';
import newSong from './newPlaylist.js';
import Lyrics from './Lyrics.js';
import { FaVolumeHigh } from "react-icons/fa6";
// import { FaVolumeMute } from "react-icons/fa";
import { IoVolumeMute } from "react-icons/io5";
import useAudioVisualizer from './hooks/useAudioVisualizer.js';
import lyricsData from './lyricsData.js';

const MusicPlayer = () => {
  const [playing, setPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [randomPlay, setRandomPlay] = useState(false);
  const [progress, setProgress] = useState(0);
  const [newSongs, setNewSongs] = useState([]);


  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  useAudioVisualizer(audioRef, canvasRef);


  const getStoredPlaylist = () => {
    const storedPlaylist = localStorage.getItem('playlist');
    return storedPlaylist ? JSON.parse(storedPlaylist) : [];
  };

  const [originalPlaylist, setOriginalPlaylist] = useState(newSong);
  const [playlist, setPlaylist] = useState(originalPlaylist);
  const lyricsAvailable = !!lyricsData[playlist[currentSongIndex].title];


  const playerRef = useRef(null);

  const playPauseToggle = () => setPlaying((prev) => !prev);
  const handleVolumeChange = (vol) => { setVolume(vol); setIsMuted(vol === 0); }
  const toggleMute = () => {
    if (isMuted) {
      setVolume(0.5);     // restore to 50%
    } else {
      setVolume(0);       // mute
    }
    setIsMuted(!isMuted); // toggle icon
  };
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
      <div className='cover-container bg-gradient-to-tr from-pink-900 to-black p-3 rounded-xl'>

        <div className='playing bg-gradient-to-t from-gray-700 to-red-800/0'>
          <div className='mx-2'>
            {/* <div id='currentsong'><strong>🏴‍☠️ Treasure playing </strong></div> */}
            <div className='flex justify-between my-2 p-2 rounded-md border-0 border-x-2 shadow-md bg-gradient-to-tr from-gray-700 to-red-800'>
              <div><i>{playlist[currentSongIndex].title}</i></div>
              <div className='text-gray-400'><i>Singer: {playlist[currentSongIndex].singer}</i></div>
            </div>
          </div>
          <div className='playnav'>
            <div id="playcontrol  ">
              <button id='prev' onClick={playPreviousSong}><img src='./images/previous.png' alt='Previous' /></button>
              <button id='play' onClick={playPauseToggle}>
                <div className=' rounded-full' style={{ backgroundColor: playing ? '#0BFFA0' : '#11F00C', padding: '3px' }} >
                  {playing ? <img src='./images/pause-button.png' alt='Pause' /> : <img src='./images/play.png' alt='Play' />}
                </div>
              </button>
              <button id='next' onClick={playNextSong}><img src='./images/next.png' alt='Next' /></button>
              <button id='random' onClick={toggleRandomPlay}>
                <div className=' rounded-full' style={{ backgroundColor: randomPlay ? '#FFAA00' : 'red', padding: '3px' }} >
                  <img src='./images/shuffle (1).png' alt='shuffle' style={{ filter: randomPlay ? 'contrast(250%)' : 'contrast(80%)' }} />
                </div>
              </button>
            </div>
            <div className='vol-search'>
              <button
                onClick={toggleMute}
                className='text-2xl p-2 cursor-pointer mr-2'
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? <IoVolumeMute /> : <FaVolumeHigh />}
              </button>
              <input
                id='vol'
                type='range'
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className='accent-blue-500 cursor-pointer'
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
            onReady={() => {
              const internalAudio = document.querySelector('audio');
              if (internalAudio) audioRef.current = internalAudio;
            }}
          />
        </div>
      </div>

      <div id='playlist custom-scroll'>
        <div className='pirateplay mb-5'>
          <h2>⚓ Pirate Playlist</h2>
          {/* <button onClick={} className=''>Add Songs</button> */}
          <div className='search-file flex gap-3 items-center'>
            {/* Hidden file input */}
            <input
              type='file'
              accept='audio/*'
              multiple
              onChange={handleFileChange}
              ref={(ref) => (window.songInput = ref)} // quick external reference
              style={{ display: 'none' }}
            />

            {/* Choose File Trigger */}
            <button
              onClick={() => window.songInput?.click()}
              className='px-1 lg:px-3 py-1 rounded text-sm lg:text-md text-black bg-green-200 hover:bg-gray-100'
            >
              🎵 Choose Songs
            </button>

            {/* Show how many selected */}
            {newSongs.length > 0 && (
              <span className='text-sm text-green-400'>
                {newSongs.length} song{newSongs.length > 1 ? 's' : ''} selected
              </span>
            )}

            {/* Add Songs */}
            <button
              onClick={() => {
                handleAddSongs();
                if (window.songInput) window.songInput.value = ''; // reset input
              }}
              disabled={newSongs.length === 0}
              className='text-sm lg:text-md bg-gradient-to-r from-blue-500 to-green-500 px-3 py-1 rounded-full text-white  hover:opacity-90 disabled:opacity-50'
            >
              ➕ Add to Playlist
            </button>
          </div>

        </div>

        <div className={`listLyric h-[500px] flex ${lyricsAvailable ? 'flex-row' : 'flex-col'}`}>
          <div className={`songlist custom-scroll ${lyricsAvailable ? 'w-1/2' : 'w-full'}`}>
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

          {lyricsAvailable && (
            <div className='lyrics-container custom-scroll w-1/2'>
              <Lyrics songTitle={playlist[currentSongIndex].title} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
