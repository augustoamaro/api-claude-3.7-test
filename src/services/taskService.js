const { tasks, getNextId, validateTask } = require('../models/taskModel');
const AppError = require('../utils/appError');

/**
 * Retorna todas as tarefas
 * @returns {Promise<Array>} Lista de tarefas
 */
const getAllTasks = async () => {
    return tasks;
};

/**
 * Busca uma tarefa pelo ID
 * @param {string|number} id - ID da tarefa
 * @returns {Promise<Object|null>} Tarefa encontrada ou null
 */
const getTaskById = async (id) => {
    if (!id) throw new AppError('ID da tarefa é obrigatório', 400);

    const taskId = parseInt(id, 10);
    if (isNaN(taskId)) throw new AppError('ID da tarefa deve ser um número', 400);

    return tasks.find(task => task.id === taskId);
};

/**
 * Cria uma nova tarefa
 * @param {string} title - Título da tarefa
 * @param {string} [description] - Descrição da tarefa (opcional)
 * @returns {Promise<Object>} Tarefa criada
 */
const createTask = async (title, description = '') => {
    const taskData = { title, description };
    const validation = validateTask(taskData);

    if (!validation.isValid) {
        throw new AppError(validation.errors.join(', '), 400);
    }

    const newTask = {
        id: getNextId(),
        title,
        description,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    tasks.push(newTask);
    return newTask;
};

/**
 * Atualiza uma tarefa existente
 * @param {string|number} id - ID da tarefa
 * @param {Object} updates - Campos a serem atualizados
 * @returns {Promise<Object|null>} Tarefa atualizada ou null
 */
const updateTask = async (id, updates) => {
    if (!id) throw new AppError('ID da tarefa é obrigatório', 400);

    const taskId = parseInt(id, 10);
    if (isNaN(taskId)) throw new AppError('ID da tarefa deve ser um número', 400);

    // Validar os dados de atualização
    const validation = validateTask(updates);
    if (!validation.isValid) {
        throw new AppError(validation.errors.join(', '), 400);
    }

    const task = tasks.find(task => task.id === taskId);
    if (!task) return null;

    // Não permitir atualização de campos protegidos
    const safeUpdates = { ...updates };
    delete safeUpdates.id;
    delete safeUpdates.createdAt;

    // Atualizar a tarefa
    Object.assign(task, safeUpdates, { updatedAt: new Date() });
    return task;
};

/**
 * Remove uma tarefa
 * @param {string|number} id - ID da tarefa
 * @returns {Promise<Object|null>} Tarefa removida ou null
 */
const deleteTask = async (id) => {
    if (!id) throw new AppError('ID da tarefa é obrigatório', 400);

    const taskId = parseInt(id, 10);
    if (isNaN(taskId)) throw new AppError('ID da tarefa deve ser um número', 400);

    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) return null;

    return tasks.splice(taskIndex, 1)[0];
};

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
};