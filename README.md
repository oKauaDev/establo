# 🚀 API de Gerenciamento de Usuários e Estabelecimentos

API RESTful para gestão de usuários, estabelecimentos, produtos e regras comerciais, desenvolvida em Node.js com TypeScript e DynamoDB.

## 🛠 Tecnologias utilizadas

- **Node.js** v18+
- **TypeScript**
- **AWS DynamoDB**
- **UUID** (geração de IDs)
- **Express.js** (roteamento)
- **Dotenv** (variáveis de ambiente)
- **Jest** (testes e2e de toda a aplicação)

## ⚙️ Pré-requisitos

- Conta AWS para DynamoDB
- Node.js e npm instalados
- AWS CLI configurado (para acesso local ao DynamoDB)

## 🔧 Instalação

```bash
# Clonar repositório
git clone https://github.com/oKauaDev/establo.git

# Instalar dependências
npm install

# Configurar variáveis de ambiente (crie um arquivo .env na raiz)
cp .env.example .env
```

## ⚙️ Variáveis de Ambiente

```env
AWS_REGION=us-east-1
PORT=3000
```

## 🏗 Estrutura do Projeto

```md
tests/
└── \*.test.ts
src/
├── aws/
├── controllers/
├── middlewares/
├── routes/
├── services/
├── types/
├── utils/
├── app.ts
└── index.ts
```

## ▶️ Execução

```bash
# Iniciar servidor em desenvolvimento
npm run dev

# Buildar projeto
npm run build

# Executar versão compilada
npm start
```

## 📡 Endpoints da API

Você pode importar também para o postman, o arquivo está em `requests/Establo.postman_collection.json`

### 👤 Usuários

| Método | Endpoint           | Descrição            | Body Obrigatório        |
| ------ | ------------------ | -------------------- | ----------------------- |
| POST   | `/user/create`     | Cria novo usuário    | `{ name, email, type }` |
| GET    | `/user/find/:id`   | Busca usuário por ID | -                       |
| PUT    | `/user/edit/:id`   | Atualiza usuário     | `{ campo: valor }`      |
| DELETE | `/user/delete/:id` | Remove usuário       | -                       |
| GET    | `/user/list`       | Lista todos usuários | -                       |

### 🏢 Estabelecimentos

| Método | Endpoint                        | Descrição                          | Body/Parâmetros                 |
| ------ | ------------------------------- | ---------------------------------- | ------------------------------- |
| POST   | `/establishment/create`         | Cria novo estabelecimento          | `{ name, ownerId, type }`       |
| GET    | `/establishment/find/:id`       | Busca estabelecimento por ID       | -                               |
| PUT    | `/establishment/edit/:id`       | Atualiza estabelecimento           | `{ campo: valor }`              |
| DELETE | `/establishment/delete/:id`     | Remove estabelecimento             | -                               |
| GET    | `/establishment/query`          | Busca por nome e tipo              | Query Params: `name`, `type`    |
| GET    | `/establishment/rules/:id`      | Busca regras do estabelecimento    | -                               |
| PUT    | `/establishment/rules/:id/edit` | Atualiza regras do estabelecimento | `{ picturesLimit, videoLimit }` |

### 🛍 Produtos

| Método | Endpoint                         | Descrição                          | Body Obrigatório                   |
| ------ | -------------------------------- | ---------------------------------- | ---------------------------------- |
| POST   | `/product/create`                | Cria novo produto                  | `{ name, establishmentId, price }` |
| GET    | `/product/find/:id`              | Busca produto por ID               | -                                  |
| PUT    | `/product/edit/:id`              | Atualiza produto                   | `{ campo: valor }`                 |
| DELETE | `/product/delete/:id`            | Remove produto                     | -                                  |
| GET    | `/product/list`                  | Lista todos produtos               | -                                  |
| GET    | `/product/list/:establishmentId` | Lista produtos por estabelecimento | -                                  |

## 🔒 Regras de Negócio

1. Apenas usuários do tipo `owner` podem criar estabelecimentos
2. Limites de produtos são controlados pelas regras de:
   - `picturesLimit`: Número máximo de fotos permitidas
   - `videoLimit`: Número máximo de vídeos permitidos

## 📊 Configuração do DynamoDB

1. Crie tabelas com os nomes:

   - `UsersTable`
   - `EstablishmentsTable`
   - `ProductsTable`
   - `RulesTable`

2. Defina `id` como chave primária em todas as tabelas

## 🧪 Testes

```bash
npm test
```

## 📌 Considerações

- Todos os IDs são gerados como UUID v4
- Validações de entrada implementadas em todos endpoints
- Tratamento de erros centralizado
- Documentação completa dos tipos TypeScript
