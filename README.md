# API de Gerenciamento de Tarefas

Uma API RESTful para gerenciamento de tarefas, construída com Node.js e Express, com interface gamificada.

## Características

- Arquitetura em camadas (MVC)
- Princípio de Responsabilidade Única (SRP)
- Validação de dados
- Tratamento de erros centralizado
- Documentação de código
- Configuração centralizada
- Logging
- Interface gamificada
- Categorização de tarefas
- Priorização de tarefas
- Estatísticas e métricas
- Filtros e ordenação
- Operações em lote

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
│   ├── task/       # Controladores de tarefas com responsabilidade única
│   └── category/   # Controladores de categorias com responsabilidade única
├── middleware/     # Middlewares do Express
├── models/         # Modelos de dados
├── routes/         # Rotas da API
├── services/       # Lógica de negócios
│   ├── task/       # Serviços de tarefas com responsabilidade única
│   └── category/   # Serviços de categorias com responsabilidade única
├── utils/          # Utilitários
└── app.js          # Ponto de entrada da aplicação

public/
├── css/            # Estilos da aplicação
├── js/             # Scripts da aplicação
└── index.html      # Página principal
```

## Arquitetura

O projeto segue uma arquitetura baseada no princípio de responsabilidade única (SRP), onde cada componente tem uma única responsabilidade bem definida:

### Serviços

Cada serviço é responsável por uma única operação de negócio:

#### Serviços de Tarefas
- `CreateTaskService`: Criação de tarefas
- `GetAllTasksService`: Listagem de tarefas com filtros
- `GetTaskByIdService`: Busca de tarefa por ID
- `UpdateTaskService`: Atualização de tarefa
- `DeleteTaskService`: Exclusão de tarefa
- `BulkUpdateTaskStatusService`: Atualização em massa do status de tarefas
- `GetTaskStatsService`: Obtenção de estatísticas de tarefas

#### Serviços de Categorias
- `CreateCategoryService`: Criação de categorias
- `GetAllCategoriesService`: Listagem de categorias
- `GetCategoryByIdService`: Busca de categoria por ID
- `UpdateCategoryService`: Atualização de categoria
- `DeleteCategoryService`: Exclusão de categoria

### Controladores

Cada controlador é responsável por uma única rota/operação:

#### Controladores de Tarefas
- `CreateTaskController`: Criação de tarefas
- `GetAllTasksController`: Listagem de tarefas
- `GetTaskByIdController`: Busca de tarefa por ID
- `UpdateTaskController`: Atualização de tarefa
- `DeleteTaskController`: Exclusão de tarefa
- `BulkUpdateTaskStatusController`: Atualização em massa do status de tarefas
- `GetTaskStatsController`: Obtenção de estatísticas de tarefas

#### Controladores de Categorias
- `CreateCategoryController`: Criação de categorias
- `GetAllCategoriesController`: Listagem de categorias
- `GetCategoryByIdController`: Busca de categoria por ID
- `UpdateCategoryController`: Atualização de categoria
- `DeleteCategoryController`: Exclusão de categoria

## Endpoints da API

### Tarefas

- `GET /api/tasks` - Listar todas as tarefas
  - Parâmetros de consulta:
    - `completed`: Filtrar por status de conclusão (true/false)
    - `priority`: Filtrar por prioridade (baixa/média/alta)
    - `categoryId`: Filtrar por categoria
    - `search`: Buscar por termo
    - `dueBefore`: Filtrar por data de vencimento (antes de)
    - `dueAfter`: Filtrar por data de vencimento (depois de)
    - `sortBy`: Campo para ordenação (title, priority, dueDate, etc.)
    - `sortOrder`: Ordem de classificação (asc/desc)
- `GET /api/tasks/:id` - Obter uma tarefa específica
- `POST /api/tasks` - Criar uma nova tarefa
- `PUT /api/tasks/:id` - Atualizar uma tarefa existente
- `DELETE /api/tasks/:id` - Remover uma tarefa
- `POST /api/tasks/bulk-update` - Atualizar o status de várias tarefas
- `GET /api/tasks/stats` - Obter estatísticas das tarefas

### Categorias

- `GET /api/categories` - Listar todas as categorias
- `GET /api/categories/:id` - Obter uma categoria específica
- `POST /api/categories` - Criar uma nova categoria
- `PUT /api/categories/:id` - Atualizar uma categoria existente
- `DELETE /api/categories/:id` - Remover uma categoria

## Exemplo de Uso

### Criar uma nova tarefa

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Estudar Node.js",
    "description": "Aprender Express e MongoDB",
    "priority": "alta",
    "categoryId": 3,
    "dueDate": "2023-12-31"
  }'
```

### Criar uma nova categoria

```bash
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Projetos",
    "color": "#ff9900"
  }'
```

### Obter estatísticas das tarefas

```bash
curl -X GET http://localhost:3000/api/tasks/stats
```

## Interface Gamificada

A aplicação inclui uma interface gamificada que transforma o gerenciamento de tarefas em uma experiência divertida:

- **Sistema de XP**: Ganhe pontos de experiência ao completar tarefas
- **Níveis**: Suba de nível conforme acumula XP
- **Conquistas**: Desbloqueie conquistas ao atingir marcos específicos
- **Estatísticas**: Acompanhe seu progresso com estatísticas detalhadas
- **Easter Eggs**: Descubra recursos escondidos (dica: tente o código Konami)

## Princípios de Design

### Princípio de Responsabilidade Única (SRP)

Cada classe no projeto tem uma única responsabilidade, o que traz os seguintes benefícios:

- **Manutenibilidade**: Código mais fácil de manter e entender
- **Testabilidade**: Facilidade para escrever testes unitários
- **Reutilização**: Componentes podem ser reutilizados em diferentes contextos
- **Escalabilidade**: Facilidade para adicionar novas funcionalidades
- **Desacoplamento**: Redução de dependências entre componentes

## Scripts Disponíveis

- `npm start` - Inicia o servidor em modo produção
- `npm run dev` - Inicia o servidor em modo desenvolvimento com hot-reload
- `npm test` - Executa os testes

## Próximos Passos

- Implementação de banco de dados (MongoDB)
- Autenticação de usuários
- Compartilhamento de tarefas
- Notificações
- Aplicativo móvel

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes. 