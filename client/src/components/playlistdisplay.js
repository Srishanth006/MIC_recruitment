import React from 'react';

function PlaylistDisplay({ playlist }) {

  if (!playlist) {
    return null;
  }
  const { name, external_urls, tracks, images } = playlist;
  const playlistImage = images[0]?.url; 
  return (
    <div className="playlist-display">
      <h2>{name}</h2>
      <div className="playlist-header">
        {playlistImage && <img src={playlistImage} alt={`${name} cover`} width="200" />}
        <a href={external_urls.spotify} target="_blank" rel="noopener noreferrer" className="spotify-button">
          Open in Spotify
        </a>
      </div>
      <ul className="track-list">
        {tracks.items.map(({ track }) => (
          <li key={track.id} className="track-item">
            <img src={track.album.images[2]?.url} alt={track.album.name} className="track-album-art" />
            <div className="track-details">
              <div className="track-name">{track.name}</div>
              <div className="track-artist">{track.artists.map(artist => artist.name).join(', ')}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PlaylistDisplay;