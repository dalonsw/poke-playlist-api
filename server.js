const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');

// Carrega variáveis de ambiente (se existir .env)
dotenv.config();

// Configurações da API Express
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rotas organizadas (REST)
const pokemonRouter = require('./routes/pokemon');
app.use('/pokemon', pokemonRouter);

// Rota raiz informativa
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health / info
app.get('/time', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'time.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});