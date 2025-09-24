import React, { useState } from 'react';
import axios from 'axios'; 
import MoodInput from './components/moodinput';
import PlaylistDisplay from './components/playlistdisplay';
import './App.css';

function App() {
  const [mood, setMood] = useState('');
  const [playlist, setPlaylist] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  
  const handleGeneratePlaylist = async (e) => {
    e.preventDefault(); 
    setIsLoading(true); 
    setError(null); 
    setPlaylist(null); 

    try {
      
      const response = await axios.post('http://localhost:3001/api/MIC', {
        mood: mood, 
      });

  
      setPlaylist(response.data);

    } catch (err) {
  
      console.error("API call failed:", err);
      setError('Failed to generate playlist. Please try another mood.');
    } finally {
  
      setIsLoading(false); 
    }
  };

  return (
    <div className="App">
      <header>
        <h1>Mood Playlist Generator</h1>
        <p>Tell us your vibe, and we'll curate the perfect playlist for you.</p>
      </header>
      <main>
        <MoodInput
          mood={mood}
          setMood={setMood}
          onSubmit={handleGeneratePlaylist}
        />

        {isLoading && <p>Curating your playlist...</p>}
        {error && <p className="error-message">{error}</p>}
        {playlist && <PlaylistDisplay playlist={playlist} />}
      </main>
    </div>
  );
}

export default App;