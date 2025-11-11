const { getToken, getMusics } = require('../spotifyApi');
const { getPokemon } = require('../pokeApi');
const pokeTypeGenre = require('../poke_type_genre.json').pokemon_type_music;

async function buildPokemonPlaylist(identifier) {
  if (!identifier) throw new Error("Identifier inválido.");

  const token = await getToken();
  const pokemon = await getPokemon(identifier);

  const genres = pokemon.types
    .map(type => pokeTypeGenre[type])
    .filter(Boolean);

  if (genres.length === 0) {
    throw new Error('Nenhum gênero musical encontrado para os tipos deste Pokémon.');
  }

  const playlist = [];
  let limit = genres.length === 1 ? 10 : 5;

  for (const genre of genres) {
    const musics = await getMusics(token, genre, limit);
    playlist.push(...musics);
  }

  // Shuffle
  for (let i = playlist.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [playlist[i], playlist[j]] = [playlist[j], playlist[i]];
  }

  return { pokemon, playlist };
}

module.exports = { buildPokemonPlaylist };
