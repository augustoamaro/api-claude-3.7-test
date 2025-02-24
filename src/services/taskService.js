const { tasks, getNextId, validateTask } = require('../models/taskModel');
const AppError = require('../utils/appError');

/**
 * Retorna todas as tarefas
 * @param {Object} filters - Filtros para as tarefas
 * @returns {Promise<Array>} Lista de tarefas
 */
const getAllTasks = async (filters = {}) => {
    let filteredTasks = [...tasks];

    // Aplicar filtros
    if (filters.completed !== undefined) {
        const isCompleted = filters.completed === 'true';
        filteredTasks = filteredTasks.filter(task => task.completed === isCompleted);
    }

    if (filters.priority) {
        filteredTasks = filteredTasks.filter(task => task.priority === filters.priority);
    }

    if (filters.categoryId) {
        const categoryId = parseInt(filters.categoryId, 10);
        filteredTasks = filteredTasks.filter(task => task.categoryId === categoryId);
    }

    if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredTasks = filteredTasks.filter(task =>
            task.title.toLowerCase().includes(searchTerm) ||
            (task.description && task.description.toLowerCase().includes(searchTerm))
        );
    }

    if (filters.dueBefore) {
        const dueBefore = new Date(filters.dueBefore);
        filteredTasks = filteredTasks.filter(task =>
            task.dueDate && new Date(task.dueDate) <= dueBefore
        );
    }

    if (filters.dueAfter) {
        const dueAfter = new Date(filters.dueAfter);
        filteredTasks = filteredTasks.filter(task =>
            task.dueDate && new Date(task.dueDate) >= dueAfter
        );
    }

    // Ordenação
    if (filters.sortBy) {
        const sortField = filters.sortBy;
        const sortOrder = filters.sortOrder === 'desc' ? -1 : 1;

        filteredTasks.sort((a, b) => {
            if (sortField === 'dueDate') {
                const dateA = a.dueDate ? new Date(a.dueDate) : new Date(0);
                const dateB = b.dueDate ? new Date(b.dueDate) : new Date(0);
                return sortOrder * (dateA - dateB);
            }

            if (a[sortField] < b[sortField]) return -1 * sortOrder;
            if (a[sortField] > b[sortField]) return 1 * sortOrder;
            return 0;
        });
    }

    return filteredTasks;
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
 * @param {Object} additionalData - Dados adicionais da tarefa
 * @returns {Promise<Object>} Tarefa criada
 */
const createTask = async (title, description = '', additionalData = {}) => {
    const taskData = {
        title,
        description,
        ...additionalData
    };

    const validation = validateTask(taskData);

    if (!validation.isValid) {
        throw new AppError(validation.errors.join(', '), 400);
    }

    const newTask = {
        id: getNextId(),
        title,
        description,
        completed: false,
        priority: additionalData.priority || 'média',
        categoryId: additionalData.categoryId || null,
        dueDate: additionalData.dueDate || null,
        tags: additionalData.tags || [],
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

/**
 * Marca várias tarefas como concluídas ou pendentes
 * @param {Array<number>} ids - IDs das tarefas
 * @param {boolean} completed - Status de conclusão
 * @returns {Promise<Array>} Tarefas atualizadas
 */
const bulkUpdateTaskStatus = async (ids, completed) => {
    if (!Array.isArray(ids)) {
        throw new AppError('IDs devem ser um array', 400);
    }

    const updatedTasks = [];
    const notFoundIds = [];

    for (const id of ids) {
        const taskId = parseInt(id, 10);
        if (isNaN(taskId)) continue;

        const task = tasks.find(task => task.id === taskId);
        if (!task) {
            notFoundIds.push(id);
            continue;
        }

        task.completed = completed;
        task.updatedAt = new Date();
        updatedTasks.push(task);
    }

    if (notFoundIds.length > 0) {
        throw new AppError(`Tarefas não encontradas: ${notFoundIds.join(', ')}`, 404);
    }

    return updatedTasks;
};

/**
 * Obtém estatísticas das tarefas
 * @returns {Promise<Object>} Estatísticas
 */
const getTaskStats = async () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const pendingTasks = totalTasks - completedTasks;

    // Estatísticas por prioridade
    const priorityStats = {
        alta: tasks.filter(task => task.priority === 'alta').length,
        média: tasks.filter(task => task.priority === 'média').length,
        baixa: tasks.filter(task => task.priority === 'baixa').length
    };

    // Estatísticas por categoria
    const categoryStats = {};
    tasks.forEach(task => {
        if (task.categoryId) {
            categoryStats[task.categoryId] = (categoryStats[task.categoryId] || 0) + 1;
        }
    });

    // Tarefas vencidas
    const today = new Date();
    const overdueTasks = tasks.filter(task =>
        !task.completed &&
        task.dueDate &&
        new Date(task.dueDate) < today
    ).length;

    return {
        total: totalTasks,
        completed: completedTasks,
        pending: pendingTasks,
        overdue: overdueTasks,
        byPriority: priorityStats,
        byCategory: categoryStats
    };
};

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    bulkUpdateTaskStatus,
    getTaskStats
};