const { getToken, getMusics } = require('../spotifyApi');
const { getPokemon } = require('../pokeApi');
const { buildPokemonPlaylist } = require('../services/pokemonPlaylistService');
const { get } = require('../routes/pokemon');
const pokemonTeam = [];

// Controlador para obter playlist baseada no Pokémon
getPokemonPlaylist = async (req, res, next) => {
  try {
    const { pokemon, playlist } = await buildPokemonPlaylist(req.params.identifier);
    res.json({ pokemon, playlist });
  } catch (error) {
    next(error);
  }
};

// Controlador para obter playlist baseada no time de pokémons
getTeamPlaylist = async (req, res, next) => {
  try {
    if (pokemonTeam.length === 0) {
      return res.status(400).json({ error: 'O time de pokémons está vazio.' });
    }
    const combinedPlaylist = [];
    const pokemonDetails = [];

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
    // Shuffle
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

    if (pokemonTeam.length >= 6) {
      return res.status(400).json({ error: 'Time de pokémons já está cheio (máximo de 6).' });
    }

    if (pokemonTeam.find(p => p.pokemon.id === pokemon.id)) {
      return res.status(400).json({ error: 'Pokémon já está no time.' });
    }

    // salva o objeto completo { pokemon, playlist }
    pokemonTeam.push({
      pokemon,
      playlist
    });

    res.json({
      message: 'Pokémon adicionado ao time com sucesso.',
      team: pokemonTeam
    });
  } catch (error) {
    next(error);
  }
};

// Ver time
viewPokemonTeam = (req, res, next) => {
  res.json({ message: 'Time de Pokémon carregado com sucesso.', team: pokemonTeam });
};

// Atualizar Pokémon no time
updatePokemonTeam = async (req, res, next) => {
  const { identifier, newIdentifier } = req.body;

  try {
    if (!identifier || !newIdentifier) {
      return res.status(400).json({ error: "Identifiers inválidos." });
    }

    // Agora o time guarda { pokemon, playlist }
    const index = pokemonTeam.findIndex(
      p =>
        p.pokemon.id === parseInt(identifier) ||
        p.pokemon.name.toLowerCase() === identifier.toLowerCase()
    );

    if (index === -1) {
      return res.status(404).json({ error: 'Pokémon não encontrado no time.' });
    }

    // Carrega o novo Pokémon + playlist
    const { pokemon: newPokemon, playlist: newPlaylist } =
      await buildPokemonPlaylist(newIdentifier);

    if (!newPokemon || !newPokemon.id) {
      return res.status(404).json({ error: "Novo Pokémon inválido." });
    }

    // Atualiza substituindo TUDO: Pokémon + Playlist
    pokemonTeam[index] = {
      pokemon: newPokemon,
      playlist: newPlaylist
    };

    res.json({
      message: 'Pokémon atualizado com sucesso.',
      team: pokemonTeam
    });

  } catch (error) {
    next(error);
  }
};

// Deletar Pokémon
deletePokemonFromTeam = (req, res, next) => {
  const { identifier } = req.params;

  const index = pokemonTeam.findIndex(
    p =>
      p.pokemon.id === parseInt(identifier) ||
      p.pokemon.name.toLowerCase() === identifier.toLowerCase()
  );

  if (index === -1) {
    return res.status(404).json({ error: 'Pokémon não encontrado no time.' });
  }

  pokemonTeam.splice(index, 1);

  res.json({
    message: 'Pokémon removido do time com sucesso.',
    team: pokemonTeam
  });
};

module.exports = { getPokemonPlaylist, getTeamPlaylist, timePokemonPlaylist, viewPokemonTeam, updatePokemonTeam, deletePokemonFromTeam };
