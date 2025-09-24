import React from 'react';
function MoodInput({ mood, setMood, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="mood-form">
      <textarea
        value={mood}
        onChange={(e) => setMood(e.target.value)}
        placeholder="e.g., a rainy day in a cozy coffee shop"
        rows="3"
        required
      />
      <button type="submit">Generate Playlist</button>
    </form>
  );
}

export default MoodInput;