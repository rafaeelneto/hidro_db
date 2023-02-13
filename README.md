# HIDRO-db

Development of a platform that
Desenvolvimento de uma interface acessível para o banco de dados contendo os pontos de captação de água.

## Banco de dados

Instância em servidor PostgresSQL v9+ com extensão PostGIS instalada.

### Pre requisitos

- postgis
  `CREATE EXTENSION postgis`
- postgresql-9.6-postgis-3
- postgresql-9.6-postgis-3-dbgsym
- postgresql-9.6-postgis-3-scripts
- uuid-ossp
  `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`

Após adição dos plugins podem ser colocados os dados da tabela e também inicializado o hasura

## Docker

Antes de inicializar o arquivo docker-compose deve ser feito o build da imagem em hidro-db/server/Dockerfile (antes do build é necessário rodar o comando `npm start`).

No arquivo docker-compose deve ser modificada a variável de ambiente do Hasura graphQl

`HASURA_GRAPHQL_DATABASE_URL: postgres://postgres:postgres@docker.for.win.localhost:5432/hidro_db_dev`

**A CHAVE JWT NA VARIÁVEL DE AMBIENTE DA IMAGEM NODE JS E HASURA DEVEM SER IGUAIS**

**Make sure your docker is allowed to mount the directory C:\...\hidro-db\...**

## Cliente React

App base criando com o comando create-react-app

`npm install`

`npm start`
