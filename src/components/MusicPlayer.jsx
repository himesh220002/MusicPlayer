// MusicPlayer.js

import React, { useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import './Mplayer.css';
import newSong from './newPlaylist.js';

import Lyrics from './Lyrics.js';


const MusicPlayer = () => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [randomPlay, setRandomPlay] = useState(false);

  const getStoredPlaylist = () => {
    const storedPlaylist = localStorage.getItem('playlist');
    return storedPlaylist ? JSON.parse(storedPlaylist) : [];
  };

  const [originalPlaylist, setOriginalPlaylist] = useState(newSong);
  const [playlist, setPlaylist] = useState(originalPlaylist);


  const playerRef = useRef(null);

  const playPauseToggle = () => {
    setPlaying((prevPlaying) => !prevPlaying);
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
  };

  const [progress, setProgress] = useState(0);

  const handleProgress = (progress) => {
    // Update the progress state
    setProgress(progress.played);
  };
  const handleProgressBarClick = (e) => {
    // Calculate the percentage of the click position within the progress bar
    const clickPosition = e.clientX - e.target.getBoundingClientRect().left;
    const progressBarWidth = e.target.offsetWidth;
    const percentageClicked = clickPosition / progressBarWidth;

    // Update the progress state and seek to the clicked position
    setProgress(percentageClicked);
    playerRef.current.seekTo(percentageClicked, 'fraction');
  };

  const handleEnded = () => {
    // Play the next song when the current one ends
    playNextSong();
  };



  const handleSearch = (searchTerm) => {
    // Update the playlist based on the search results
    const filteredPlaylist = originalPlaylist.filter((song) =>
      song.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // If the search term is empty, revert to the original playlist
    const updatedPlaylist = searchTerm.trim() === '' ? originalPlaylist : filteredPlaylist;

    setPlaylist(updatedPlaylist);
  };



  const handleClick = (index) => {
    setCurrentSongIndex(index);
    setPlaying(true);
  };

  const playNextSong = () => {
    if (randomPlay) {
      // Generate a random index different from the current index
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * playlist.length);
      } while (randomIndex === currentSongIndex);

      setCurrentSongIndex(randomIndex);
    } else {
      // Play the next song sequentially
      setCurrentSongIndex((prevIndex) => (prevIndex + 1) % playlist.length);
    }
  };

  const playPreviousSong = () => {
    if (randomPlay) {
      // Generate a random index different from the current index
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * playlist.length);
      } while (randomIndex === currentSongIndex);

      setCurrentSongIndex(randomIndex);
    } else {
      // Play the previous song sequentially
      setCurrentSongIndex((prevIndex) => (prevIndex - 1 + playlist.length) % playlist.length);
    }
  };

  const toggleRandomPlay = () => {
    setRandomPlay((prevRandomPlay) => !prevRandomPlay);
  };

  const [newSongs, setNewSongs] = useState([]);

  const handleFileChange = (e) => {
    const files = e.target.files;
    setNewSongs([...newSongs, ...files]);
  };

  const handleAddSongs = () => {
    // Process the new songs and add them to the playlist
    // For simplicity, let's assume each file has a title and URL
    const addedSongs = newSongs.map(file => ({
      title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension from title
      url: URL.createObjectURL(file),
    }));

    setPlaylist([...playlist, ...addedSongs]);
    setNewSongs([]); // Clear the array for the next selection
  };

  return (
    <div className='music'>
    
      

      <div className='cover-container'>
        <img
          src={playlist[currentSongIndex].coverImage || '/images/cover.webp'}
          alt='Album Cover'
          className='cover-image'
        />
      </div>

      
      
      <div className='playing'>
      
      <div className='playnav'>
      
        <div>
        <button id='prev' onClick={playPreviousSong}>
          <img src='./images/previous.png' alt='Previous' /> {/* Replace with your own icon */}
        </button>
        <button id='play' onClick={playPauseToggle}>
          {playing ? <img src='./images/pause-button.png' alt='Pause' /> : <img src='./images/play.png' alt='Play' />} {/* Replace with your own icons */}
        </button>
        <button id='next' onClick={playNextSong}>
          <img src='./images/next.png' alt='Next' /> {/* Replace with your own icon */}
        </button>
        <button id='random' onClick={toggleRandomPlay}>
          {randomPlay ? <img style={{filter : "contrast(250%)"}} src='./images/shuffle (1).png' alt='shuffle' />:<img src='./images/shuffle (1).png' alt='shuffle' />}
        </button>
        </div>
          <div className='vol-search'>
          <div>
          <input
            id='vol'
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
          />
          </div>
          {/* <div>
          <input
            type="text"
            placeholder="Search..."
            className='search'
            onChange={(e) => handleSearch(e.target.value)}
          />
          </div> */}
          </div>

        </div>
        
        <div id='currentsong'>
        <p><strong>🏴‍☠️ Treasure playing: </strong> <i>{playlist[currentSongIndex].title}</i></p>
        </div>
        
      </div>
     
      <div id='progress-bar'>
        <progress value={progress} max={1} onClick={handleProgressBarClick}></progress>
      </div>

      <div className='react-player-container'>
          <ReactPlayer
            ref={playerRef}
            url={playlist[currentSongIndex].url}
            playing={playing}
            volume={volume}
            onPlay={() => console.log('onPlay')}
            onPause={() => console.log('onPause')}
            onEnded={handleEnded}
            onProgress={handleProgress}
            controls
            className='react-player'
          />
        </div>

      <div id='playlist'>
        <div className='pirateplay'>
          <div>
            <h2>⚓ Pirate Playlist</h2>
          </div>
          
            <div className='search-file'>
            <input
              type="file"
              accept="audio/*"
              multiple
              onChange={handleFileChange}
            />
            <button onClick={handleAddSongs} ><img src="./images/add.png" style={{"width":"30px", "height":"30px"}} alt="add"/></button>
          
          </div>
        </div>
        <ul>
          {playlist.map((song, index) => (
            <li
              key={index}
              onClick={() => handleClick(index)}
              className={index === currentSongIndex ? 'playing-song' : ''}
            >
              🎶 {song.title}
            </li>
          ))}
        </ul>
      </div>
      
      <div className='lyrics-container'>
        <Lyrics songTitle={playlist[currentSongIndex].title} />
      </div>
     
    </div>
    
  );
};

export default MusicPlayer;
