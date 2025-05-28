# API de Despesas

API REST para gerenciamento de despesas pessoais construída com NestJS, Prisma ORM e PostgreSQL.

## 🚀 Tecnologias

- NestJS
- Prisma ORM
- PostgreSQL
- JWT para autenticação
- Swagger para documentação
- Class Validator para validação de DTOs

## 📋 Pré-requisitos

- Node.js (v16+)
- PostgreSQL
- npm ou yarn

## 🔧 Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Configure o banco de dados no arquivo `.env`:
```env
DB_HOST=localhost
DB_PORT=1234
DB_USER=postgres
DB_PASS=senha
DB_NAME=nome_banco_de_dados
DATABASE_URL=postgres://postgres:{password}@{host}/{db}
JWT_SECRET="your-secret-key-here"
```

4. Execute as migrações do Prisma:
```bash
npx prisma migrate dev
```

5. Gere o cliente Prisma:
```bash
npx prisma generate
```

## 🏃‍♂️ Executando o projeto

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

## 📚 Documentação da API

Acesse a documentação Swagger em: http://localhost:3000/api

## 🔐 Autenticação

A API usa JWT para autenticação. Para fins de demonstração, você pode usar este token:

```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

## 🛣️ Rotas Disponíveis

### Despesas

- `POST /expenses` - Criar uma nova despesa
- `GET /expenses` - Listar todas as despesas (com filtros opcionais)
- `GET /expenses/:id` - Buscar despesa por ID
- `PATCH /expenses/:id` - Atualizar uma despesa
- `DELETE /expenses/:id` - Excluir uma despesa

### Filtros disponíveis

- `?month=05` - Filtrar por mês
- `?year=2025` - Filtrar por ano
- `?category=Alimentação` - Filtrar por categoria
- Combinações: `?month=05&year=2025&category=Alimentação`

## 📝 Exemplo de Requisição

### Criar despesa
```json
POST /expenses
{
  "title": "Almoço no restaurante",
  "amount": 45.50,
  "category": "Alimentação",
  "date": "2025-05-27"
}
```

### Resposta
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Almoço no restaurante",
  "amount": 45.50,
  "category": "Alimentação",
  "date": "2025-05-27T00:00:00.000Z",
  "createdAt": "2025-05-27T10:30:00.000Z",
  "updatedAt": "2025-05-27T10:30:00.000Z"
}
```

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Coverage
npm run test:cov
```

## 🐳 Docker

Use o docker-compose para subir o PostgreSQL:

```bash
docker-compose up -d
```
