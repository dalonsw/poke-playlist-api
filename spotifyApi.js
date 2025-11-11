// Código para pegar o Token da Api do Spotify (CommonJS)
// Convertido para CommonJS: export -> module.exports, removido await de nível superior
async function getToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const tokenUrl = 'https://accounts.spotify.com/api/token';

  if (!clientId || !clientSecret) {
    throw new Error('SPOTIFY_CLIENT_ID e SPOTIFY_CLIENT_SECRET não estão definidos nas variáveis de ambiente.');
  }

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      // btoa is not available in Node; use Buffer for base64
      Authorization: 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
    },
    body: 'grant_type=client_credentials',
  });

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
  const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(genre)}&type=track&limit=${limit}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const text = await response.text(); // evita erro de json vazio
    throw new Error(`Erro ao buscar músicas: HTTP ${response.status} - ${text}`);
  }

  const data = await response.json();

  return data.tracks.items.map((item) => ({
    name: item.name,
    artist: item.artists.map((artist) => artist.name).join(', '),
    album: item.album.name,
    url: item.external_urls.spotify,
  }));
}

module.exports = { getToken, getMusics };