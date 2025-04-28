const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

// Ruta simple
app.get('/', (req, res) => {
  res.send('¡Hola desde el backend de la Pokedex!');
});

// Configuramos el puerto dinámico
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
