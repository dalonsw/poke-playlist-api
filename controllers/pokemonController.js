const { getToken, getMusics } = require('../spotifyApi');
const { getPokemon } = require('../pokeApi');
const { buildPokemonPlaylist } = require('../services/pokemonPlaylistService');
const { get } = require('../routes/pokemon');
const pokemonTeam = [];

// Controlador para obter playlist baseada no Pokémon
getPokemonPlaylist = async (req, res, next) => {
  // Obtém a playlist baseada no Pokémon
  try {
    const { pokemon, playlist } = await buildPokemonPlaylist(req.params.identifier);
    res.json({ pokemon, playlist });
  } catch (error) {
    next(error);
  }
};

// Controlador para obter playlist baseada no time de pokémons
getTeamPlaylist = async (req, res, next) => {
  // Obtém a playlist combinada do time de pokémons
  try {
    if (pokemonTeam.length === 0) {
      return res.status(400).json({ error: 'O time de pokémons está vazio.' });
    }
    const combinedPlaylist = [];
    const pokemonDetails = [];

    // Para cada pokémon no time, obtém a playlist e adiciona à playlist combinada
    for (const member of pokemonTeam) {
      const { pokemon } = member;
      const { playlist } = await buildPokemonPlaylist(pokemon.id);
      const uniqueTracks = new Map();
      for (const track of playlist) {
        uniqueTracks.set(track.id, track);
      }
      combinedPlaylist.push(...uniqueTracks.values());
      pokemonDetails.push(pokemon);
    }
    // Embaralha a playlist
    for (let i = combinedPlaylist.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [combinedPlaylist[i], combinedPlaylist[j]] = [combinedPlaylist[j], combinedPlaylist[i]];
    }
    res.json({ team: pokemonDetails, playlist: combinedPlaylist });

  } catch (error) {
    console.error(error);
  }
};

// Adicionar Pokémon ao time
timePokemonPlaylist = async (req, res, next) => {
  try {
    const { pokemon, playlist } = await buildPokemonPlaylist(req.body.identifier);

    // Verifica se o time já está cheio
    if (pokemonTeam.length >= 6) {
      return res.status(400).json({ error: 'Time de pokémons já está cheio (máximo de 6).' });
    }

    // Verifica se o Pokémon já está no time
    if (pokemonTeam.find(p => p.pokemon.id === pokemon.id)) {
      return res.status(400).json({ error: 'Pokémon já está no time.' });
    }
    
    // Adiciona o Pokémon e sua playlist ao time
    pokemonTeam.push({
      pokemon,
      playlist
    });

    // Retorna o time atualizado
    res.json({
      message: 'Pokémon adicionado ao time com sucesso.',
      team: pokemonTeam
    });
  } catch (error) {
    console.error(error);
    if (error.message.includes('Identifier inválido')) {
      return res.status(400).json({ error: 'Identifier inválido.' });
    }
    next(error);
  }
};

// Ver time
viewPokemonTeam = (req, res, next) => {
  // Retorna o time de pokémons
  res.json({ message: 'Time de Pokémon carregado com sucesso.', team: pokemonTeam });
};

// Atualizar Pokémon no time
updatePokemonTeam = async (req, res, next) => {
  // Obtém os identificadores do corpo da requisição
  const { identifier, newIdentifier } = req.body;

  try {
    // Verifica se os identificadores são válidos
    if (!identifier || !newIdentifier) {
      return res.status(400).json({ error: "Identifiers inválidos." });
    }

    // Encontra o índice do Pokémon a ser atualizado
    const index = pokemonTeam.findIndex(
      p =>
        p.pokemon.id === parseInt(identifier) ||
        p.pokemon.name.toLowerCase() === identifier.toLowerCase()
    );

    // Verifica se o Pokémon foi encontrado no time
    if (index === -1) {
      return res.status(404).json({ error: 'Pokémon não encontrado no time.' });
    }

    // Carrega o novo Pokémon + playlist
    const { pokemon: newPokemon, playlist: newPlaylist } =
      await buildPokemonPlaylist(newIdentifier);

    // Verifica se o novo Pokémon é válido
    if (!newPokemon || !newPokemon.id) {
      return res.status(404).json({ error: "Novo Pokémon inválido." });
    }

    // Atualiza o Pokémon no time
    pokemonTeam[index] = {
      pokemon: newPokemon,
      playlist: newPlaylist
    };

    // Retorna o time atualizado
    res.json({
      message: 'Pokémon atualizado com sucesso.',
      team: pokemonTeam
    });

  } catch (error) {
    console.error(error);
  }
};

// Deletar Pokémon
deletePokemonFromTeam = (req, res, next) => {
  // Obtém o identificador dos parâmetros da requisição
  const { identifier } = req.params;

  // Encontra o índice do Pokémon a ser removido
  const index = pokemonTeam.findIndex(
    p =>
      p.pokemon.id === parseInt(identifier) ||
      p.pokemon.name.toLowerCase() === identifier.toLowerCase()
  );

  // Verifica se o Pokémon foi encontrado no time
  if (index === -1) {
    return res.status(404).json({ error: 'Pokémon não encontrado no time.' });
  }

  // Remove o Pokémon do time
  pokemonTeam.splice(index, 1);

  // Retorna o time atualizado
  res.json({
    message: 'Pokémon removido do time com sucesso.',
    team: pokemonTeam
  });
};

module.exports = { getPokemonPlaylist, getTeamPlaylist, timePokemonPlaylist, viewPokemonTeam, updatePokemonTeam, deletePokemonFromTeam };
