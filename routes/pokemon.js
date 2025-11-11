const express = require('express');
const router = express.Router();
const controller = require('../controllers/pokemonController');

// Rota de informação
// GET /pokemon/ -> info
router.get('/', (req, res) => {
  res.json({ message: 'Use /pokemon/:identifier para obter playlist baseada no tipo do Pokémon.' });
});

// Coloque as rotas /team antes da rota dinâmica /:identifier
// Rota para adicionar pokémon no time (Max de 6 pokémons)
// POST /pokemon/team
router.post('/team', controller.timePokemonPlaylist);

// Rota para ver o time de pokémons
// GET /pokemon/team -> team
router.get('/team', controller.viewPokemonTeam);

// Rota para atualizar o time de pokémons
// PUT /pokemon/team
router.put('/team', controller.updatePokemonTeam);

// Rota para deletar um pokémon do time
// DELETE /pokemon/team/:identifier
router.delete('/team/:identifier', controller.deletePokemonFromTeam);

// Rota para pegar uma playlist baseada em um pokémon
// GET /pokemon/:identifier -> playlist
router.get('/:identifier', controller.getPokemonPlaylist);


module.exports = router;