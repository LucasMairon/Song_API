import React, { useState, useRef } from "react";
import "./index.css";

const App = () => {
  const [songData, setSongData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50); // Volume inicial
  const [songId, setSongId] = useState(""); // ID ou nome da música
  const audioRef = useRef(null); // Referência para o elemento <audio>

  // Função para buscar os dados da música pelo nome (ID ou título)
  const fetchSongData = async (searchTerm) => {
    try {
      const response = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}&limit=1`
      );

      if (!response.ok) {
        throw new Error("Erro ao acessar a iTunes API");
      }

      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const song = data.results[0]; // Pega a primeira música encontrada
        setSongData({
          albumImage: song.artworkUrl100.replace("100x100", "300x300"),
          title: song.trackName,
          artist: song.artistName,
          preview: song.previewUrl, // URL de preview da música
        });
      } else {
        alert("Música não encontrada!");
      }
    } catch (error) {
      console.error("Erro ao buscar dados da música:", error);
      alert("Erro ao carregar os dados da música.");
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (event) => {
    const newVolume = event.target.value;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
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
          placeholder="Digite o nome da música"
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
          <h2 className="song-title">
            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(
                songData.title
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {songData.title}
            </a>
          </h2>
          <h3 className="artist-name">
            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(
                songData.artist
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {songData.artist}
            </a>
          </h3>

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
          <audio
            ref={audioRef}
            src={songData.preview}
            onEnded={() => setIsPlaying(false)}
          />
        </>
      ) : null}
    </div>
  );
};

export default App;
