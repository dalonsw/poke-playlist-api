// Função para buscar dados do Pokémon
async function getPokemon(identifier) {
  // Query a ser feita na PokeAPI
  const url = `https://pokeapi.co/api/v2/pokemon/${identifier}`;

  // Requisição para buscar o Pokémon
  const response = await fetch(url);

  // Verifica se a requisição foi bem sucedida
  if (!response.ok) {
    const text = await response.text();
    const err = new Error(`Erro ao buscar Pokémon: HTTP ${response.status} - ${text}`);
    err.status = response.status;
    throw err;
  }

  // Extrai os dados da resposta
  const data = await response.json();

  // Retorna apenas as informações necessárias
  return {
    id: data.id,
    name: data.name,
    types: data.types.map((typeInfo) => typeInfo.type.name),
    sprite: `https://img.pokemondb.net/artwork/large/${data.name}.jpg`
  };
}

module.exports = { getPokemon };