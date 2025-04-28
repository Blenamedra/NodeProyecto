import { Routes, Route } from 'react-router-dom';
import Menu from './pages/Menu';
import PaginaA from './pages/PaginaA';
import PaginaB from './pages/PaginaB';
import './App.css'; //CSS para la pagina
import PaginaPokedex from './pages/PaginaPokedex';
import PaginaCartas from './pages/PaginaCartas';

function App() {
  return(
    <Routes>
      <Route path="/" element={<Menu />} />
      <Route path='/PaginaPokedex' element={<PaginaPokedex />} />
      <Route path='/PaginaCartas' element={<PaginaCartas />} />
    </Routes>
  )
}

export default App;