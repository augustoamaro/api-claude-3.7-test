const { tasks, getNextId, validateTask } = require('../../models/taskModel');
const AppError = require('../../utils/appError');

/**
 * Serviço responsável pela criação de tarefas
 */
class CreateTaskService {
    /**
     * Cria uma nova tarefa
     * @param {string} title - Título da tarefa
     * @param {string} [description] - Descrição da tarefa (opcional)
     * @param {Object} additionalData - Dados adicionais da tarefa
     * @returns {Promise<Object>} Tarefa criada
     */
    async execute(title, description = '', additionalData = {}) {
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
    }
}

module.exports = new CreateTaskService(); 