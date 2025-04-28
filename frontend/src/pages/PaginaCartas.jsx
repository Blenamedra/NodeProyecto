import React, { useState } from 'react';
import axios from 'axios';
import './PaginaCartas.css';

function PaginaCartas() {
  const [pokemonName, setPokemonName] = useState('');
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearchChange = (e) => {
    setPokemonName(e.target.value);
  };

  const fetchCard = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`https://api.pokemontcg.io/v2/cards?q=name:${pokemonName}`);
      setCards(response.data.data);
      setLoading(false);
      if (response.data.data.length === 0) {
        setError('No se encontró la carta del Pokémon');
      }
    } catch (err) {
      setError('Error al obtener la carta');

      setLoading(false);
    }
  };

  return (
    <div className="pagina-cartas-container">
      {/* Botón de regresar */}
      <button onClick={() => window.history.back()} className="back-button">← Regresar</button>

      <h2>Pokemon TCG</h2>

      {/* Barra de búsqueda */}
      <div className="search-container">
        <input
          type="text"
          value={pokemonName}
          onChange={handleSearchChange}
          placeholder="Escribe el nombre del Pokémon"
          className="search-input"
        />
        <button onClick={fetchCard} className="search-button">Buscar carta</button>
      </div>

      {/* Mensaje de error o cargando */}
      {loading && <img src='./public/Poke.gif'></img>}
      {error && <p className="error-message">{error}</p>}

      {/* Mostrar la imagen de la carta */}
      {cards.length > 0 && !loading && !error && (
        <div className="card-image-container">
          <img src={cards[0].images.small} alt={cards[0].name} className="card-image" />
        </div>
      )}
    </div>
  );
}

export default PaginaCartas;
