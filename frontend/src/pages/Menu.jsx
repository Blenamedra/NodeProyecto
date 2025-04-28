import { useNavigate } from 'react-router-dom';
import './Menu.css';

function Menu(){
    const Navigate = useNavigate();

    return(
        <div className='Menu'>
            <h1>Pokémon</h1>
            <h2>Gotta Catch 'Em All!</h2>
            <h3>Esta es una pagina para dar un vistaso rapido a pokemon, ya sea el TCG (Juego de cartas) o a la pokedex</h3>
            <p> Elige una opcion </p>
            <button onClick={() => Navigate('/PaginaPokedex')}>
                Pokedex
            </button>
            <button onClick={() => Navigate('/PaginaCartas')}>
                Pokemon TCG
            </button> 
        </div>
    );
}

export default Menu;