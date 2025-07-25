# 🎬 CTicket - Movie Rental System

Sistema completo de gerenciamento de locação de filmes com autenticação, CRUD de usuários, filmes e
locações.

## 🚀 Tecnologias

- **Vue 3** + **TypeScript**
- **Vite** - Build tool ultra rápido
- **Tailwind CSS** - Estilização utility-first
- **Pinia** - Gerenciamento de estado
- **VeeValidate** - Validação de formulários
- **Vue Router** - Navegação
- **Docker** - Containerização

## 📋 Pré-requisitos

- **Node.js** >= 18.x
- **npm** ou **yarn**
- **Docker** (opcional, para containerização)

## 🛠️ Instalação Local

### 1. Clone o repositório

```bash
git clone https://github.com/lucasdasilva182/comerc-front-challenge.git
cd comerc-front-challenge
```

### 2. Instale as dependências

```bash
npm install
# ou
yarn install
```

### 3. Inicie o servidor de desenvolvimento

```bash
npm run dev
# ou
yarn dev
```

Acesse: http://localhost:5173

## 🐳 Docker (Alternativa)

### Opção 1: Usando Docker Compose (Recomendado)

```bash
# Constrói e inicia os containers
docker-compose up -d

# Acesse: http://localhost:8080
```

### Opção 2: Docker CLI

```bash
# Build da imagem
docker build -t cticket-app .

# Roda o container
docker run -p 8080:80 cticket-app

# Acesse: http://localhost:8080
```

## 📦 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento
npm run build         # Build para produção
npm run test          # Executa testes
npm run test:watch    # Executa testes em modo watch
```

## 🗂️ Estrutura do Projeto

```
src/
├── assets/          # Imagens e assets estáticos
├── components/      # Componentes reutilizáveis
│   └── ui/         # Componentes de interface (Button, Input, etc.)
├── layouts/        # Layouts da aplicação
├── pages/          # Páginas da aplicação
├── routes/         # Configuração de rotas
├── services/       # Serviços/API
├── stores/         # Stores do Pinia
```

## 🎯 Funcionalidades

### 🔐 Autenticação

- Login/Registro de usuários
- Proteção de rotas
- Gerenciamento de sessão

### 👥 Usuários

- CRUD completo de clientes
- Validação de CPF único
- Status ativo/inativo

### 🎥 Filmes

- Busca por título e ano
- Integração com OMDB API
- Paginação de resultados
- Imagens com fallback

### 🎟️ Locações

- Sistema de aluguel de filmes
- Validação de locações ativas
- Histórico de locações
- Status (alugado/entregue)

## 🧪 Testes

O projeto utiliza **Vitest** + **Vue Test Utils** para testes:

```bash
# Executar todos os testes
npm run test

# Executar testes em modo watch
npm run test:watch

# Gerar relatório de cobertura
npm run test:coverage
```

## 🚢 Deploy

### Para produção:

```bash
# Build da aplicação
npm run build

# Os arquivos estarão em /dist
# Pode ser servido por qualquer servidor web estático
```

### Com Docker:

```bash
# Build e push da imagem
docker build -t seu-usuario/cticket-app:latest .
docker push seu-usuario/cticket-app:latest
```

## 📄 Licença

MIT License - veja o arquivo [LICENSE](LICENSE) para mais detalhes.
