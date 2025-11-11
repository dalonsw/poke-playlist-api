Poke Playlist API

Esta é uma API que gera playlists no Spotify baseadas nos tipos de Pokémon. Você pode obter uma playlist para um Pokémon específico ou para um time de até 6 Pokémon.

## Endpoints
- `GET /pokemon/:identifier`: Obtém uma playlist baseada no tipo do Pokémon identificado por nome ou ID.
- `POST /pokemon/time`: Adiciona um Pokémon ao time (máximo de 6 Pokémon).
- `GET /time`: Visualiza o time atual de Pokémon e a playlist correspondente.
- `PUT /time`: Atualiza o time de Pokémon.
- `DELETE /time/:identifier`: Remove um Pokémon do time pelo nome ou ID.

## Configuração
1. Clone o repositório.
2. Instale as dependências com `npm install`.
3. Crie um arquivo `.env` com suas credenciais do Spotify:
4.   SPOTIFY_CLIENT_ID=seu_client_id
5.   SPOTIFY_CLIENT_SECRET=seu_client_secret
6.  Inicie o servidor com `node server.js`.
7.  Acesse a API em `http://localhost:3000/pokemon`.

## Tecnologias Utilizadas
- Node.js
- Express
- Spotify API
- PokéAPI

## Autores
- Daniel Alonso
- João Gabriel
