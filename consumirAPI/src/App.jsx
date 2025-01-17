import React, { useState } from "react";
import "./index.css";

const App = () => {
  const [songData, setSongData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50); // Volume inicial
  const [showLyrics, setShowLyrics] = useState(false);
  const [songId, setSongId] = useState(""); // ID da música ou nome

  // Função para buscar os dados da música pelo nome (ID ou título)
  const fetchSongData = async (searchTerm) => {
    try {
      const response = await fetch(
        `https://cors-anywhere.herokuapp.com/https://api.deezer.com/search?q=${encodeURIComponent(
          searchTerm
        )}`
      );

      const data = await response.json();

      if (data && data.data && data.data.length > 0) {
        const song = data.data[0]; // Pega a primeira música encontrada
        setSongData({
          albumImage: song.album.cover_big,
          title: song.title,
          artist: song.artist.name,
          preview: song.preview, // URL de preview da música
          lyrics: "Lyrics are not provided by Deezer.", // Deezer não fornece letras
        });
      } else {
        alert("Música não encontrada!");
      }
    } catch (error) {
      console.error("Erro ao buscar dados da música:", error);
      alert("Erro ao carregar dados!");
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (event) => {
    setVolume(event.target.value);
  };

  const toggleLyrics = () => {
    setShowLyrics(!showLyrics);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    fetchSongData(songId); // Chama a função para buscar a música
  };

  return (
    <div className="music-player">
      <h1>Busque uma Música</h1>

      {/* Campo de busca (por ID ou título da música) */}
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          value={songId}
          onChange={(e) => setSongId(e.target.value)}
          placeholder="Digite o nome ou ID da música"
        />
        <button type="submit">Buscar Música</button>
      </form>

      {songData ? (
        <>
          {/* Imagem do Álbum */}
          <img
            src={songData.albumImage}
            alt={`Album cover for ${songData.title}`}
            className="album-image"
          />

          {/* Título e Artista */}
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
        </>
      ) : null}
    </div>
  );
};

export default App;
