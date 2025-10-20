// Importa módulos necessários
const express = require('express'); // Framework para criar servidor HTTP
const cors = require('cors'); // Permite requisições de outros domínios
const bodyParser = require('body-parser'); // Lê dados do corpo das requisições
const path = require('path'); // Manipula caminhos de arquivos

// Cria o app Express
const app = express();
app.use(cors()); // Usa CORS em todas as rotas
app.use(bodyParser.json()); // Faz parse de JSON no corpo das requisições

// Define pasta atual como pública (HTML, CSS, JS etc.)
app.use(express.static(path.join(__dirname)));

// Banco de dados simulado (em memória)
let items = [
  { id: 1, title: 'Item 1', body: 'Conteúdo 1' }, // Item 1
  { id: 2, title: 'Item 2', body: 'Conteúdo 2' }  // Item 2
];
let nextId = 3; // Próximo ID disponível

// Rota GET → retorna todos os itens
app.get('/api/items', (req, res) => {
  res.json(items); // Envia lista como JSON
});

// Rota GET → retorna item pelo ID
app.get('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id, 10); // Converte ID da URL para número
  const item = items.find(i => i.id === id); // Busca item pelo ID
  if (!item) return res.status(404).json({ error: 'Not found' }); // Se não achar, retorna erro 404
  res.json(item); // Retorna o item encontrado
});

// Rota POST → cria novo item
app.post('/api/items', (req, res) => {
  const { title, body } = req.body; // Extrai dados do corpo da requisição
  if (!title) return res.status(400).json({ error: 'title is required' }); // Verifica se o título foi enviado
  const item = { id: nextId++, title, body }; // Cria novo item com ID autoincrementado
  items.push(item); // Adiciona ao array
  res.status(201).json(item); // Retorna o item criado com status 201 (Created)
});

// Rota PUT → atualiza item pelo ID
app.put('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id, 10); // Converte ID da URL para número
  const index = items.findIndex(i => i.id === id); // Encontra índice do item
  if (index === -1) return res.status(404).json({ error: 'Not found' }); // Se não achar, retorna 404
  const { title, body } = req.body; // Pega novos valores
  // Atualiza título e corpo se existirem, senão mantém os antigos
  items[index] = { ...items[index], title: title ?? items[index].title, body: body ?? items[index].body };
  res.json(items[index]); // Retorna item atualizado
});

// Rota DELETE → remove item pelo ID
app.delete('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id, 10); // Converte ID da URL
  const index = items.findIndex(i => i.id === id); // Busca índice
  if (index === -1) return res.status(404).json({ error: 'Not found' }); // Se não achar, 404
  const removed = items.splice(index, 1)[0]; // Remove item do array
  res.json(removed); // Retorna o item removido
});

// Atualizar os dados no HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'api-demo-express.html')); //Enviar o HTML para o endpoint /
});

const port = process.env.PORT || 3000; // Porta para conexão da API
app.listen(port, () => console.log(`Server running on http://localhost:${port}`)); // Escuta da API no localhost

