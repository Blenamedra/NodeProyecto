const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;


app.use(cors()); // para permitir conexion desde el frontend
app.use(express.json());

//ruta simple
app.get('/',(req,res) => {
    res.json({mensaje: 'Hola desde el backend de Express!'});
});

app.listen(PORT,() => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});