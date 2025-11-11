const { getToken, getMusics } = require('../spotifyApi');
const { getPokemon } = require('../pokeApi');
const pokeTypeGenre = require('../poke_type_genre.json').pokemon_type_music;

// Função para construir a playlist baseada no Pokémon
async function buildPokemonPlaylist(identifier) {
  // Verifica se o identificador foi fornecido
  if (!identifier) throw new Error("Identifier inválido.");

  // Obtém o token, dados do Pokémon e gêneros musicais
  const token = await getToken();
  const pokemon = await getPokemon(identifier);

  // Mapeia os tipos do Pokémon para gêneros musicais
  const genres = pokemon.types
    .map(type => pokeTypeGenre[type])
    .filter(Boolean);

  // Verifica se encontrou algum gênero
  if (genres.length === 0) {
    throw new Error('Nenhum gênero musical encontrado para os tipos deste Pokémon.');
  }

  // Busca músicas para cada gênero e constrói a playlist
  const playlist = [];
  let limit = genres.length === 1 ? 10 : 5;

  // Para cada gênero, busca as músicas e adiciona à playlist
  for (const genre of genres) {
    const musics = await getMusics(token, genre, limit);
    playlist.push(...musics);
  }

  // Embaralha a playlist
  for (let i = playlist.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [playlist[i], playlist[j]] = [playlist[j], playlist[i]];
  }

  // Retorna o Pokémon e a playlist construída
  return { pokemon, playlist };
}

module.exports = { buildPokemonPlaylist };
