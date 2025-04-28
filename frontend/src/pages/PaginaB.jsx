import { useState, useEffect } from 'react';
import axios from 'axios';
import './PaginaB.css';

function PaginaB() {
  const [pokemonData, setPokemonData] = useState(null);
  const [error, setError] = useState('');
  const [pokemonName, setPokemonName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [moves, setMoves] = useState([]);

  useEffect(() => {
    if (searchQuery) {
      fetchPokemonData(searchQuery.toLowerCase());
    }
  }, [searchQuery]);

  const fetchPokemonData = async (name) => {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}?language=es`);
      setPokemonData(response.data);
      fetchMoves(response.data.moves);
      setError('');
    } catch (err) {
      setError('Error al cargar los datos del Pokémon');
      console.error(err);
    }
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
    fetchPokemonData(searchQuery.toLowerCase());
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
                <th>Tipo</th>
              </tr>
            </thead>
            <tbody>
              {pokemonData.abilities.map((ability, idx) => (
                <tr key={idx}>
                  <td>{ability.ability.name}</td>
                  <td>{ability.is_hidden ? 'Oculta' : 'Normal'}</td>
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
    <div className="pagina-b-container">
      {/* Barra de búsqueda */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar Pokémon"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button onClick={handleSearchClick} className="search-button">Buscar</button>
      </div>

      {/* Botón de regresar */}
      <button onClick={() => window.history.back()} className="back-button">← Regresar</button>

      <h2>Detalles de {pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)}</h2>

      {error && <p className="error-message">{error}</p>}

      {pokemonData && (
        <div className="pokemon-container">
          <div className="pokemon-images">
            <div className="pokemon-image">
              <img src={pokemonData.sprites.front_default} alt={`${pokemonName} normal`} />
              <p>Normal</p>
            </div>
            <div className="pokemon-image">
              {pokemonData.sprites.front_shiny && (
                <img src={pokemonData.sprites.front_shiny} alt={`${pokemonName} shiny`} />
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
    </div>
  );
}

export default PaginaB;
