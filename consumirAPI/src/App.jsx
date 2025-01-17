import React, { useState, useEffect } from "react";
import "./index.css";

const App = () => {
  const [songData, setSongData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [showLyrics, setShowLyrics] = useState(false);

  const songId = "3135556"; // ID da música no Deezer (exemplo: Harder, Better, Faster, Stronger - Daft Punk)

  useEffect(() => {
    const fetchSongData = async () => {
      try {
        const response = await fetch(`https://cors-anywhere.herokuapp.com/api.deezer.com/track/${songId}`);
        if (!response.ok) {
          throw new Error(`Erro na API Deezer: ${response.status}`);
        }

        const data = await response.json();
        console.log(data)
        setSongData({
          albumImage: data.album.cover,
          title: data.title,
          artist: data.artist.name,
          preview: data.album.link, // URL de preview da música (30s)
          lyrics: "Lyrics are not provided by Deezer.", // Deezer não fornece letras
        });
      } catch (error) {
        console.error("Erro ao buscar dados da música:", error);
        setSongData({ error: "Não foi possível carregar os dados da música." });
      }
    };

    fetchSongData();
  }, [songId]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (event) => {
    setVolume(event.target.value);
  };

  const toggleLyrics = () => {
    setShowLyrics(!showLyrics);
  };

  if (!songData) {
    return <div className="loading">Carregando dados da música...</div>;
  }

  if (songData.error) {
    return <div className="error">{songData.error}</div>;
  }

  return (
    <div className="music-player">
      {/* Imagem do Álbum */}
      <img
        src={songData.albumImage}
        alt={`Capa do álbum ${songData.title}`}
        className="album-image"
      />

      {/* Título e Autor */}
      <h2 className="song-title">{songData.title}</h2>
      <h3 className="artist-name">{songData.artist}</h3>

      {/* Controle de Volume */}
      <div className="volume-control">
        <label htmlFor="volume">Volume: {volume}%</label>
        <input
          type="range"
          id="volume"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolumeChange}
        />
      </div>

      {/* Botão de Play/Pause */}
      <button className="play-pause-button" onClick={togglePlayPause}>
        {isPlaying ? "Pause" : "Play"}
      </button>

      {/* Reprodução do Preview */}
      {isPlaying && (
        <audio
          src={songData.preview}
          autoPlay
          loop
          volume={volume / 100}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
        />
      )}

      {/* Letra da Música */}
      <div className="lyrics-section">
        <button className="lyrics-toggle" onClick={toggleLyrics}>
          {showLyrics ? "Hide Lyrics" : "Show Lyrics"}
        </button>
        {showLyrics && <p className="lyrics">{songData.lyrics}</p>}
      </div>
    </div>
  );
};

export default App;
