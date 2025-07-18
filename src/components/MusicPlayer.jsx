import React, { useState, useRef, useEffect } from 'react';
import { searchFromRapid } from './utils/spotifyRapid.js';
import ReactPlayer from 'react-player';
import './Mplayer.css';
import newSong from './newPlaylist.js';
import Lyrics from './Lyrics.js';
import { FaVolumeHigh } from "react-icons/fa6";
import { IoVolumeMute } from "react-icons/io5";
// import useAudioVisualizer from './hooks/useAudioVisualizer.js';
import lyricsData from './lyricsData.js';
import { FaChevronDown, FaChevronUp, FaRandom } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";

const MusicPlayer = () => {
  const [playing, setPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [randomPlay, setRandomPlay] = useState(false);
  const [progress, setProgress] = useState(0);
  const [newSongs, setNewSongs] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpotifyTrackId, setSelectedSpotifyTrackId] = useState('18lR4BzEs7e3qzc0KVkTpU');
  const [selectedSpotifyPlaylistId, setSelectedSpotifyPlaylistId] = useState('0Y44bc2Fd2IfbhqSPnNlTC');
  const [visibleCount, setVisibleCount] = useState(16); // initially show 16
  const [showSpotifyResults, setShowSpotifyResults] = useState(true);
  const [loadingTrack, setLoadingTrack] = useState(false);
  const [loadingPlaylist, setLoadingPlaylist] = useState(false);

  const spotifyIframeRef = useRef(null);
  const spotifySearchTrackRef = useRef(null);
  const spotifySearchPlaylistRef = useRef(null);



  const [sections, setSections] = useState({
    track: true,
    artist: false,
    genre: false,
    playlist: false,
    user: false
  });

  const toggleSection = (key) => {
    setSections({
      track: false,
      artist: false,
      genre: false,
      playlist: false,
      user: false,
      [key]: true,
    });
  };



  const [spotifyMusicTrack, setSpotifyMusicTrack] = useState([]);
  const [spotifyMusicPlaylist, setSpotifyMusicPlaylist] = useState([]);

  // const [spotyfyMusicArtist, setSpotyfyMusicArtist] = useState([]);
  // const [spotyfyMusicGenre, setSpotyfyMusicGenre] = useState([]);
  // const [spotyfyMusicUser, setSpotyfyMusicUser] = useState([]);
  // const [searchResults, setSearchResults] = useState([]);

  const inputRef = useRef(null);
  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  // useAudioVisualizer(audioRef, canvasRef);

  const [originalPlaylist, setOriginalPlaylist] = useState(newSong);
  const [playlist, setPlaylist] = useState(newSong);

  const currentSong = playlist[currentSongIndex];
  const lyricsAvailable = !!(currentSong && lyricsData[currentSong.title]);


  const playerRef = useRef(null);

  const playPauseToggle = () => setPlaying((prev) => !prev);
  const handleVolumeChange = (vol) => { setVolume(vol); setIsMuted(vol === 0); };
  const toggleMute = () => {
    if (isMuted) setVolume(0.5);
    else setVolume(0);
    setIsMuted(!isMuted);
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

  const SkeletonCard = () => (
    <div className="bg-gray-800 animate-pulse rounded-lg p-2">
      <div className="w-full h-40 bg-gray-700 rounded mb-2"></div>
      <div className="h-4 bg-gray-600 rounded mb-1 w-3/4"></div>
      <div className="h-3 bg-gray-600 rounded w-1/2"></div>
    </div>
  );


  const getMusic = async () => {
    if (!searchQuery.trim()) return;
    setLoadingPlaylist(true);
    
    const url = `https://spotify23.p.rapidapi.com/search/?q=${encodeURIComponent(searchQuery)}&type=multi&offset=0&limit=100&numberOfTopResults=20`;
    const options = {
      method: 'GET',
      headers: {
        // 'x-rapidapi-key': process.env.SPOTIFY_RAPID_API_KEY, // sh@gm.cm
        'x-rapidapi-key': process.env.SPOTIFY_V4_RAPID_API_KEY, // versioname4
        'x-rapidapi-host': 'spotify23.p.rapidapi.com'
      }
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();

      const tracks = result?.tracks?.items || [];
      const playlists = result?.playlists?.items || [];

      // const artists = result?.artists?.items || [];
      // const genres = result?.genres?.items || [];
      // const users = result?.users?.items || [];


      setSpotifyMusicTrack(tracks);
      setSpotifyMusicPlaylist(playlists);

      // setSpotifyMusicArtist(artists);
      // setSpotifyMusicGenre(genres);
      // setSpotiyMusicUser(users);
    } catch (error) {
      console.error('Spotify search error:', error);
    } finally {
       setLoadingPlaylist(false);
      
    }
  };


  useEffect(() => {
    getMusic()
  }, [])

  return (
    <div className='music'>
      <div className='cover-container bg-gradient-to-tr from-pink-900 to-black p-3 rounded-xl'>
        <div className='playing bg-gradient-to-t from-gray-700 to-red-800/0'>
          <div className='mx-2'>
            <div className='flex justify-between my-2 p-2 rounded-md border-0 border-x-2 shadow-md bg-gradient-to-tr from-gray-700 to-red-800'>
              <div><i>{currentSong?.title || '🎵 No Song Selected'}</i></div>
              <div className='text-gray-400'><i>Singer: {currentSong?.singer || 'Unknown'}</i></div>
            </div>
          </div>

          <div className='playnav'>
            <div id="playcontrol">
              <button id='prev' onClick={playPreviousSong}><img src='./images/previous.png' alt='Previous' /></button>
              <button id='play' onClick={playPauseToggle}>
                <div className='rounded-full' style={{ backgroundColor: playing ? '#0BFFA0' : '#11F00C', padding: '3px' }} >
                  {playing ? <img src='./images/pause-button.png' alt='Pause' /> : <img src='./images/play.png' alt='Play' />}
                </div>
              </button>
              <button id='next' onClick={playNextSong}><img src='./images/next.png' alt='Next' /></button>
              <button id='random' onClick={toggleRandomPlay}>
                <div className='rounded-full' style={{ backgroundColor: randomPlay ? '#FFAA00' : 'red', padding: '3px' }} >
                  {/* <img src='./images/shuffle (1).png' alt='shuffle' style={{ filter: randomPlay ? 'contrast(250%)' : 'contrast(80%)' }} /> */}
                  <FaRandom className='rounded-full w-7 h-7 md:w-12 md:h-12  border-2 border-red-700 p-1 bg-red-600' style={{ filter: randomPlay ? 'contrast(250%)' : 'contrast(80%)' }} />
                </div>
              </button>
            </div>

            <div className='vol-search'>
              <button onClick={toggleMute}
                style={{ backgroundColor: isMuted || volume === 0 ? '#FF2255' : 'cyan', color: isMuted || volume === 0 ? 'white' : 'black' }} className='text-2xl p-1 cursor-pointer mr-2 '>
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
            src={currentSong?.coverImage || '/images/cover.webp'}
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
            url={currentSong?.url || ''}
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
          <div className='search-file flex gap-3 mt-2 lg:mt-0 items-center'>
            <input
              type='file'
              accept='audio/*'
              multiple
              onChange={handleFileChange}
              ref={(ref) => (window.songInput = ref)}
              style={{ display: 'none' }}
            />
            <button onClick={() => window.songInput?.click()} className='px-1 lg:px-3 py-1 rounded text-sm lg:text-md text-black bg-gradient-to-l from-blue-300/80 to-green-500/90  hover:bg-gray-100'>
              🎵 Choose Songs
            </button>

            {newSongs.length > 0 && (
              <span className='text-sm text-green-400'>
                {newSongs.length} song{newSongs.length > 1 ? 's' : ''} selected
              </span>
            )}

            <button
              onClick={() => {
                handleAddSongs();
                if (window.songInput) window.songInput.value = '';
              }}
              disabled={newSongs.length === 0}
              className='text-sm lg:text-md bg-gradient-to-r from-blue-500 to-green-500 px-3 py-1 rounded-full text-white  hover:opacity-90 disabled:opacity-50'
            >
              ➕ Add to Playlist
            </button>
          </div>
        </div>

        <div className={'listLyric '}>
          <div className={'songlist custom-scroll '}>

            <ul>
              {playlist.map((song, index) => (
                <li
                  key={index}
                  onClick={() => handleClick(index)}
                  className={index === currentSongIndex ? 'playing-song' : ''}
                >
                  <div style={{ display: 'flex' }}>
                    <span>🎶 {song.title} </span>

                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* {lyricsAvailable && (
            <div className='lyrics-container custom-scroll w-1/2'>
              <Lyrics songTitle={currentSong?.title} />
            </div>
          )} */}
        </div>

        <div className="flex flex-wrap gap-2 my-4">
          {["track", "playlist"/*, "artist", "genre",  "user"*/].map((type) => (
            <button
              key={type}
              onClick={() => toggleSection(type)}
              className={`px-3 py-1 rounded text-sm font-medium ${sections[type] ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'
                }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Sections */}

        <div className={`SpotifyTrack ${sections.track ? '' : 'hidden'}`}>
          <div className='flex items-center gap-2 my-4'>
            <div>
              <input
                type="text"
                ref={inputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    getMusic();
                  }
                }}
                placeholder="Search from Spotify"
                className="text-black px-2 py-1 rounded border border-gray-500"
              />
            </div>
            <div>
              <button
                onClick={() => {
                  const query = inputRef.current?.value.trim();
                  if (query) {
                    setSearchQuery(query);         // optional: keep UI state in sync
                    getMusic('track');               // use latest typed value
                    setTimeout(() => {
                      spotifySearchTrackRef.current?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }
                }}
                className='bg-blue-700 p-2 rounded-full'
              >
                <IoIosSearch />
              </button>
            </div>
          </div>

          <h4 className="text-white mb-2" ref={spotifyIframeRef}>🎶 Now Playing on Spotify</h4>

          {selectedSpotifyTrackId && (
            <div className="mt-4" >
              <iframe
                src={`https://open.spotify.com/embed/track/${selectedSpotifyTrackId}?utm_source=generator&autoplay=1`}
                width="100%"
                height="80"
                frameBorder="0"
                allowFullScreen=""
                allowtransparency="true"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="rounded-lg"
              ></iframe>
            </div>
          )}


          <div className="spotify-rapid mt-4 p-2">
            {spotifyMusicTrack.length > 0 && (
              <>
                {/* Header with toggle button */}
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-white text-lg">🎧 Spotify Search Results</h3>
                  <button
                    onClick={() => setShowSpotifyResults(prev => !prev)}
                    className="text-white text-xl px-2 hover:text-green-400 transition"
                    title={showSpotifyResults ? 'Hide Results' : 'Show Results'}
                  >
                    {showSpotifyResults ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                </div>

                {/* Result Grid + Load More, hidden together */}
                {showSpotifyResults && (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {spotifyMusicTrack
                        .filter(item => item?.data?.albumOfTrack?.coverArt?.sources?.[0]?.url)
                        .slice(0, visibleCount)
                        .map((item, index) => {
                          const data = item.data;
                          const image = data.albumOfTrack.coverArt.sources[0].url;
                          const title = data.name;
                          const artist = data.artists.items.map(a => a.profile.name).join(", ");
                          const trackId = data.id;

                          return (
                            <div
                              key={index}
                              className="bg-black rounded-lg p-2 cursor-pointer hover:bg-gray-800 transition"
                              onClick={() => {
                                setSelectedSpotifyTrackId(trackId);
                                setTimeout(() => {
                                  spotifyIframeRef.current?.scrollIntoView({ behavior: 'smooth' });
                                }, 100);
                              }}
                            >
                              <img src={image} alt={title} className="w-full h-40 object-cover rounded-md mb-2" />
                              <div className="text-white font-semibold text-sm truncate">{title}</div>
                              <div className="text-gray-400 text-xs truncate">{artist}</div>
                            </div>
                          );
                        })}
                    </div>

                    {/* Load More Button */}
                    {visibleCount < spotifyMusicTrack.length && (
                      <div className="text-center mt-4">
                        <button
                          onClick={() => setVisibleCount(prev => prev + 12)}
                          className="bg-green-900 hover:bg-green-700 text-white px-4 py-1 rounded shadow"
                        >
                          Load More
                        </button>
                      </div>
                    )}
                  </>
                )}

              </>
            )}
          </div>


        </div>




        <div className={`SpotifyPlaylist ${sections.playlist ? '' : 'hidden'}`}>
          <div className='flex items-center gap-2 my-4'>
            <div>
              <input
                type="text"
                ref={inputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    getMusic();
                    setTimeout(() => {
                      spotifySearchPlaylistRef.current?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }
                }}
                placeholder="Search from Spotify"
                className="text-black px-2 py-1 rounded border border-gray-500"
              />
            </div>
            <div>
              <button
                onClick={() => {
                  const query = inputRef.current?.value.trim();
                  if (query) {
                    setSearchQuery(query);         // optional: keep UI state in sync
                    getMusic('playlist');               // use latest typed value
                    setTimeout(() => {
                      spotifySearchPlaylistRef.current?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }
                }}
                className='bg-blue-700 p-2 rounded-full'
              >
                <IoIosSearch />
              </button>
            </div>
          </div>

          <h4 className="text-white mb-2" ref={spotifyIframeRef}>🎶 Now Playing on Spotify</h4>

          {selectedSpotifyPlaylistId && (
            <div className="mt-4" >
              <iframe
                src={`https://open.spotify.com/embed/playlist/${selectedSpotifyPlaylistId}?utm_source=generator&autoplay=1`}
                width="100%"
                height="600"
                frameBorder="0"
                allowFullScreen=""
                allowtransparency="true"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="rounded-lg"
              ></iframe>
            </div>
          )}


          <div className="spotify-rapid mt-4 p-2" ref={spotifySearchPlaylistRef}>
            {loadingPlaylist ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {Array(8).fill().map((_, idx) => <SkeletonCard key={idx} />)}
              </div>
            ): (showSpotifyResults && (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {spotifyMusicPlaylist
                    .filter(item => item?.data?.images?.items?.[0]?.sources?.[0]?.url)
                    .slice(0, visibleCount)
                    .map((item, index) => {
                      const data = item.data;
                      const image = data.images.items[0].sources[0].url;
                      const title = data.name;
                      const owner = data.owner?.name || "Unknown";
                      const playlistId = data.uri?.split(":")?.[2] || `playlist-${index}`;

                      return (
                        <div
                          key={playlistId}
                          className="bg-black rounded-lg p-2 cursor-pointer hover:bg-gray-800 transition"
                          onClick={() => {
                            setSelectedSpotifyPlaylistId(playlistId);
                            setTimeout(() => {
                              spotifyIframeRef.current?.scrollIntoView({ behavior: 'smooth' });
                            }, 100);
                          }}
                        >
                          <img src={image} alt={title} className="w-full h-40 object-cover rounded-md mb-2" />
                          <div className="text-white font-semibold text-sm truncate">{title}</div>
                          <div className="text-gray-400 text-xs truncate">By {owner}</div>
                        </div>
                      );
                    })}
                </div>

                {/* Load More Button */}
                {visibleCount < spotifyMusicPlaylist.length && (
                  <div className="text-center mt-4">
                    <button
                      onClick={() => setVisibleCount(prev => prev + 12)}
                      className="bg-green-900 hover:bg-green-700 text-white px-4 py-1 rounded shadow"
                    >
                      Load More
                    </button>
                  </div>
                )}
              </>
            ))}
            


          </div>


        </div>

        <div className={`SpotifyArtist ${sections.artist ? '' : 'hidden'}`}></div>
        <div className={`SpotifyGenre ${sections.genre ? '' : 'hidden'}`}></div>
        <div className={`SpotifyUser ${sections.user ? '' : 'hidden'}`}></div>






      </div>
    </div>
  );
};

export default MusicPlayer;
