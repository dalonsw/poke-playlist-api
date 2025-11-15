// Módulos e dependências
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');

// Carrega variáveis de ambiente (se existir .env)
dotenv.config();

// Middleware para log de requisições
const requestLogger = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
}

// Configurações da API Express
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(requestLogger);
app.use(express.static(path.join(__dirname, 'public')));

// Rotas da API
const pokemonRouter = require('./routes/pokemon');
app.use('/pokemon', pokemonRouter);

// Rota para página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para página do time de pokémons
app.get('/time', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'time.html'));
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// Inicia o servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});