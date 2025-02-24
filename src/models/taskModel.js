const { validateSchema } = require('../utils/validator');

/**
 * Armazenamento em memória para tarefas
 * @type {Array<Object>}
 */
const tasks = [];

/**
 * Armazenamento em memória para categorias
 * @type {Array<Object>}
 */
const categories = [
    { id: 1, name: 'Trabalho', color: '#4a6fa5' },
    { id: 2, name: 'Pessoal', color: '#6a4ca5' },
    { id: 3, name: 'Estudo', color: '#4ca56a' },
    { id: 4, name: 'Saúde', color: '#a54c4c' }
];

/**
 * Contador para geração de IDs únicos
 * @type {number}
 */
let idCounter = 1;

/**
 * Contador para geração de IDs únicos de categorias
 * @type {number}
 */
let categoryIdCounter = 5;

/**
 * Esquema de validação para tarefas
 */
const taskSchema = {
    title: {
        type: 'string',
        required: true,
        minLength: 3,
        maxLength: 100
    },
    description: {
        type: 'string',
        required: false,
        maxLength: 500
    },
    completed: {
        type: 'boolean',
        required: false
    },
    priority: {
        type: 'string',
        required: false,
        enum: ['baixa', 'média', 'alta']
    },
    categoryId: {
        type: 'number',
        required: false
    },
    dueDate: {
        type: 'string',
        required: false
    },
    tags: {
        type: 'array',
        required: false
    }
};

/**
 * Esquema de validação para categorias
 */
const categorySchema = {
    name: {
        type: 'string',
        required: true,
        minLength: 2,
        maxLength: 50
    },
    color: {
        type: 'string',
        required: true,
        pattern: /^#[0-9A-Fa-f]{6}$/
    }
};

/**
 * Gera um ID único para uma nova tarefa
 * @returns {number} ID único
 */
const getNextId = () => {
    return idCounter++;
};

/**
 * Gera um ID único para uma nova categoria
 * @returns {number} ID único
 */
const getNextCategoryId = () => {
    return categoryIdCounter++;
};

/**
 * Valida os dados de uma tarefa
 * @param {Object} taskData - Dados da tarefa a serem validados
 * @returns {Object} Objeto com resultado da validação
 */
const validateTask = (taskData) => {
    return validateSchema(taskData, taskSchema);
};

/**
 * Valida os dados de uma categoria
 * @param {Object} categoryData - Dados da categoria a serem validados
 * @returns {Object} Objeto com resultado da validação
 */
const validateCategory = (categoryData) => {
    return validateSchema(categoryData, categorySchema);
};

module.exports = {
    tasks,
    categories,
    getNextId,
    getNextCategoryId,
    validateTask,
    validateCategory,
    taskSchema,
    categorySchema
};