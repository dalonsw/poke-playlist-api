Poke Playlist API

Esta é uma API que gera playlists no Spotify baseadas em um Pokémon. 

Você pode obter uma playlist para um Pokémon específico ou para um time de até 6 Pokémon.

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
    SPOTIFY_CLIENT_ID=seu_client_id
    SPOTIFY_CLIENT_SECRET=seu_client_secret
6.  Inicie o servidor com `node server.js`.
7.  Acesse a API em `http://localhost:3000/pokemon`.

## Uso
### Playlist para um Pokémon
Faça uma requisição GET para `/pokemon/:identifier`, substituindo `:identifier` pelo nome ou ID do Pokémon desejado.
Exemplo: `GET /pokemon/pikachu` ou `GET /pokemon/25`

### Playlist para um Time de Pokémon
1. Adicione Pokémon ao time com uma requisição POST para `/pokemon/time` com o corpo JSON:
```json
{
  "identifier": "bulbasaur"
}
```
2. Visualize o time atual e a playlist com uma requisição GET para `/time`.
3. Atualize o time com uma requisição PUT para `/time` com o corpo JSON contendo uma lista de identificadores:
```json
{
  "identifiers": ["charmander", "squirtle", "pikachu"]
}
```
4. Remova um Pokémon do time com uma requisição DELETE para `/time/:identifier`.
Exemplo: `DELETE /time/bulbasaur`

## Interface Web
### Busca de Playlist por Pokémon
Uma interface web simples está disponível para interagir com a API. Acesse `http://localhost:3000` para usar a interface.
### Playlist para Time de Pokémon
Acesse `http://localhost:3000/time` para criar e visualizar playlists baseadas no seu time de Pokémon.

## Tecnologias Utilizadas
- Node.js
- Express
- Spotify API
- PokéAPI

## Autores
- Daniel Alonso
- João Gabriel
