import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PaginaPokedex.css';

function PaginaPokedex() {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [pokemonData, setPokemonData] = useState(null);
  const [error, setError] = useState('');
  const [moves, setMoves] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchQuery.length > 2) {
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const fetchSuggestions = async () => {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=1000`);
      const filteredSuggestions = response.data.results.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } catch (error) {
      console.error('Error fetching suggestions', error);
    }
  };

  const fetchPokemonData = async (name) => {
    setLoading(true);
    setError(''); // Clear previous error message

    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}?language=es`);
      setPokemonData(response.data);
      fetchMoves(response.data.moves);
    } catch (err) {
      setPokemonData(null); // Clear previous data if not found
      setError('Pokémon no encontrado');
      console.error(err);
    }
    setLoading(false);
  };

  const fetchMoves = async (moves) => {
    const moveDetails = await Promise.all(
      moves.map(async (move) => {
        const moveData = await axios.get(`${move.move.url}?language=es`);
        return {
          name: moveData.data.name,
          level: moveData.data.learned_at_level || 'Nivel desconocido',
          type: moveData.data.type.name,
        };
      })
    );
    setMoves(moveDetails);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchClick = () => {
    // Validar que la búsqueda no esté vacía antes de hacer la solicitud
    if (searchQuery.trim() === '') {
      setError('Por favor ingrese un nombre de Pokémon');
      setPokemonData(null); // Limpiar los datos previos si el campo está vacío
      return;
    }
  
    fetchPokemonData(searchQuery);
    setSuggestions([]);  // Limpiar sugerencias después de la búsqueda
  };
  

  const calculateStatsAtLevel50 = (statBase) => {
    return Math.floor(((2 * statBase + 31 + 252 / 4) * 50) / 100 + 10);
  };

  const renderStats = () => {
    if (pokemonData) {
      return (
        <div>
          <h4>Estadísticas a Nivel 50:</h4>
          <ul>
            {pokemonData.stats.map((stat) => {
              const level50Stat = calculateStatsAtLevel50(stat.base_stat);
              return (
                <li key={stat.stat.name}>
                  <strong>{stat.stat.name.charAt(0).toUpperCase() + stat.stat.name.slice(1)}:</strong> {level50Stat}
                </li>
              );
            })}
          </ul>
        </div>
      );
    }
    return null;
  };

  const renderAbilities = () => {
    if (pokemonData) {
      return (
        <div>
          <h4>Habilidades:</h4>
          <table>
            <thead>
              <tr>
                <th>Habilidad</th>
              </tr>
            </thead>
            <tbody>
              {pokemonData.abilities.map((ability, idx) => (
                <tr key={idx}>
                  <td>{ability.ability.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    return null;
  };

  const renderMoves = () => {
    if (moves.length > 0) {
      return (
        <div>
          <h4>Movimientos por Nivel:</h4>
          <table>
            <thead>
              <tr>
                <th>Movimiento</th>
                <th>Nivel</th>
                <th>Tipo</th>
              </tr>
            </thead>
            <tbody>
              {moves.map((move, idx) => (
                <tr key={idx}>
                  <td>{move.name}</td>
                  <td>{move.level}</td>
                  <td>{move.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="pokedex-container">
      {/* Botón de regresar */}
      <button onClick={() => window.history.back()} className="back-button">← Regresar</button>

      <h1>Pokedex</h1>

      {/* Barra de búsqueda */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar Pokémon"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button onClick={handleSearchClick} className="search-button">Buscar Pokémon</button>
        {suggestions.length > 0 && (
          <div className="suggestions">
            {suggestions.map((pokemon) => (
              <div
                key={pokemon.name}
                className="suggestion"
                onClick={() => {
                  setSearchQuery(pokemon.name);
                  setSuggestions([]);
                  fetchPokemonData(pokemon.name);
                }}
              >
                {pokemon.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mensaje de error o información */}
      {error && <p className="error-message">{error}</p>}

      {pokemonData && !error && (
        <div className="pokemon-container">
          <h2>{pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)}</h2> {/* Nombre del Pokémon */}
          <div className="pokemon-images">
            <div className="pokemon-image">
              <img src={pokemonData.sprites.front_default} alt={`${pokemonData.name} normal`} />
              <p>Normal</p>
            </div>
            <div className="pokemon-image">
              {pokemonData.sprites.front_shiny && (
                <img src={pokemonData.sprites.front_shiny} alt={`${pokemonData.name} shiny`} />
              )}
              <p>Shiny</p>
            </div>
          </div>

          {/* Estadísticas, habilidades y movimientos */}
          {renderStats()}
          {renderAbilities()}
          {renderMoves()}
        </div>
      )}

      {loading && <img src='./public/Poke.gif' alt="Cargando..."></img>}
    </div>
  );
}

export default PaginaPokedex;
