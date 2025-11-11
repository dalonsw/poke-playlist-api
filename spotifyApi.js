// Código para pegar o Token da Api do Spotify
async function getToken() {
  // Pega as credenciais do ambiente
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const tokenUrl = 'https://accounts.spotify.com/api/token';

  // Verifica se as credenciais estão definidas
  if (!clientId || !clientSecret) {
    throw new Error('SPOTIFY_CLIENT_ID e SPOTIFY_CLIENT_SECRET não estão definidos nas variáveis de ambiente.');
  }

  // Requisição para obter o token
  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
    },
    body: 'grant_type=client_credentials',
  });

  // Verifica se a requisição foi bem sucedida
  if (!response.ok) {
    const text = await response.text(); // evita erro de json vazio
    throw new Error(`Erro ao obter token do Spotify: HTTP ${response.status} - ${text}`);
  }

  // Extrai o token da resposta
  const data = await response.json();
  if (!data.access_token) {
    const err = new Error('Não foi possível obter token do Spotify.');
    err.details = data;
    throw err;
  }
  return data.access_token;
}

// Código para buscar músicas por genero no Spotify
async function getMusics(token, genre, limit) {
  // Querie a ser feita na API do Spotify
  const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(genre)}&type=track&limit=${limit}`;

  // Requisição para buscar músicas
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Verifica se a requisição foi bem sucedida
  if (!response.ok) {
    const text = await response.text(); // evita erro de json vazio
    throw new Error(`Erro ao buscar músicas: HTTP ${response.status} - ${text}`);
  }

  // Extrai as músicas da resposta
  const data = await response.json();

  // Mapeia os dados para retornar apenas as informações necessárias
  return data.tracks.items.map((item) => ({
    name: item.name,
    artist: item.artists.map((artist) => artist.name).join(', '),
    album: item.album.name,
    url: item.external_urls.spotify,
  }));
}

module.exports = { getToken, getMusics };