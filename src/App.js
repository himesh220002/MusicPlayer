// App.js

import React from 'react';
import MusicPlayer from './components/MusicPlayer';
import './App.css';
import Footer from './components/Footer/Footer';

const App = () => {
  return (
    <div>
      <h1>React Music Player</h1>
      <MusicPlayer />
      <Footer />
    </div>
  );
};

export default App;
