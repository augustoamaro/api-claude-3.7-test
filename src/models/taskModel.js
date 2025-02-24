const { validateSchema } = require('../utils/validator');

/**
 * Armazenamento em memória para tarefas
 * @type {Array<Object>}
 */
const tasks = [];

/**
 * Contador para geração de IDs únicos
 * @type {number}
 */
let idCounter = 1;

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
 * Valida os dados de uma tarefa
 * @param {Object} taskData - Dados da tarefa a serem validados
 * @returns {Object} Objeto com resultado da validação
 */
const validateTask = (taskData) => {
    return validateSchema(taskData, taskSchema);
};

module.exports = {
    tasks,
    getNextId,
    validateTask,
    taskSchema
};