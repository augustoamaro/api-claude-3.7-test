# API de Gerenciamento de Tarefas

Uma API RESTful para gerenciamento de tarefas, construída com Node.js e Express.

## Características

- Arquitetura em camadas (MVC)
- Validação de dados
- Tratamento de erros centralizado
- Documentação de código
- Configuração centralizada
- Logging

## Requisitos

- Node.js 14.x ou superior
- npm 6.x ou superior

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/tasks-api.git
cd tasks-api
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Inicie o servidor:
```bash
npm run dev
```

## Estrutura do Projeto

```
src/
├── config/         # Configurações da aplicação
├── controllers/    # Controladores da API
├── middleware/     # Middlewares do Express
├── models/         # Modelos de dados
├── routes/         # Rotas da API
├── services/       # Lógica de negócios
├── utils/          # Utilitários
└── app.js          # Ponto de entrada da aplicação
```

## Endpoints da API

### Tarefas

- `GET /api/tasks` - Listar todas as tarefas
- `GET /api/tasks/:id` - Obter uma tarefa específica
- `POST /api/tasks` - Criar uma nova tarefa
- `PUT /api/tasks/:id` - Atualizar uma tarefa existente
- `DELETE /api/tasks/:id` - Remover uma tarefa

## Exemplo de Uso

### Criar uma nova tarefa

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Estudar Node.js", "description": "Aprender Express e MongoDB"}'
```

## Scripts Disponíveis

- `npm start` - Inicia o servidor em modo produção
- `npm run dev` - Inicia o servidor em modo desenvolvimento com hot-reload
- `npm test` - Executa os testes

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes. 