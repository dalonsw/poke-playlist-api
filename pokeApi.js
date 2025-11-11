// CommonJS version: busca Pokémon na PokeAPI e retorna dados essenciais
const fetchFn = (typeof fetch !== 'undefined') ? fetch : null;
if (!fetchFn) {
  // Assumimos Node >=18 com fetch global. Se não houver, lançamos um erro claro.
  throw new Error('Global fetch não disponível. Use Node 18+ ou adicione um polyfill (ex: node-fetch).');
}

async function getPokemon(identifier) {
  const url = `https://pokeapi.co/api/v2/pokemon/${identifier}`;
  const response = await fetchFn(url);
  if (!response.ok) {
    const text = await response.text();
    const err = new Error(`Erro ao buscar Pokémon: HTTP ${response.status} - ${text}`);
    err.status = response.status;
    throw err;
  }

  const data = await response.json();

  return {
    id: data.id,
    name: data.name,
    types: data.types.map((typeInfo) => typeInfo.type.name),
    sprite: `https://img.pokemondb.net/artwork/large/${data.name}.jpg`
  };
}

module.exports = { getPokemon };