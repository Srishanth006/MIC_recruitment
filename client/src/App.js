import React, { useState } from 'react';
import axios from 'axios'; // Import axios
import MoodInput from './components/moodinput';
import PlaylistDisplay from './components/playlistdisplay';
import './App.css';

function App() {
  const [mood, setMood] = useState('');
  const [playlist, setPlaylist] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // The function that calls our back-end
  const handleGeneratePlaylist = async (e) => {
    e.preventDefault(); // Prevent the form from reloading the page
    setIsLoading(true); // Show the loading message
    setError(null); // Clear previous errors
    setPlaylist(null); // Clear previous playlist

    try {
      // Make the POST request to our server's endpoint
      const response = await axios.post('http://localhost:3000/api/MIC', {
        mood: mood, // Send the user's mood in the request body
      });

      // If successful, update the playlist state with the data from the server
      setPlaylist(response.data);

    } catch (err) {
      // If there's an error, set an error message to display to the user
      console.error("API call failed:", err);
      setError('Failed to generate playlist. Please try another mood.');
    } finally {
      // This will run whether the request succeeds or fails
      setIsLoading(false); // Hide the loading message
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
          onSubmit={handleGeneratePlaylist} // Pass the real function now
        />

        {isLoading && <p>Curating your playlist...</p>}
        {error && <p className="error-message">{error}</p>}
        {playlist && <PlaylistDisplay playlist={playlist} />}
      </main>
    </div>
  );
}

export default App;