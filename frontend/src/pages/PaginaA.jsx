import { useState, useEffect } from 'react';
import axios from 'axios';
import './PaginaA.css';

function PaginaA() {
  const [cards, setCards] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCards(); // Cargar todas las cartas al inicio
  }, []);

  // Buscar las cartas a través de la API
  const fetchCards = async () => {
    try {
      const response = await axios.get('https://api.pokemontcg.io/v2/cards');
      setCards(response.data.data); // Guardar las cartas
      setError('');
    } catch (err) {
      setError('Error al cargar las cartas');
      console.error(err);
    }
  };

  // Mostrar la carta seleccionada
  const renderCardDetails = (card) => (
    <div key={card.id} className="card-detail">
      <h3>{card.name}</h3>
      <img src={card.images.large} alt={card.name} className="card-image" />
      <p><strong>Tipo:</strong> {card.types.join(', ')}</p>
      <p><strong>Rareza:</strong> {card.rarity}</p>
      {card.hp && <p><strong>HP:</strong> {card.hp}</p>}
      {card.attacks && (
        <div>
          <h4>Movimientos:</h4>
          <ul>
            {card.attacks.map((attack, idx) => (
              <li key={idx}>{attack.name}: {attack.damage}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <div className="pagina-a-container">
        <img className='Back' src='./public/casa.png'></img>
      <h2>Cartas de Pokémon TCG</h2>

      {error && <p className="error-message">{error}</p>}

      <div className="cards-container">
        {/* Si hay cartas, mostrarlas */}
        {cards.length > 0
          ? cards.map(card => renderCardDetails(card))
          : <p>No se encontraron cartas</p>}  {/* Mensaje si no se encuentran cartas */}
      </div>
    </div>
  );
}

export default PaginaA;
