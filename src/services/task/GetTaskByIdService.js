const { tasks } = require('../../models/taskModel');
const AppError = require('../../utils/appError');

/**
 * Serviço responsável por buscar uma tarefa pelo ID
 */
class GetTaskByIdService {
    /**
     * Busca uma tarefa pelo ID
     * @param {string|number} id - ID da tarefa
     * @returns {Promise<Object|null>} Tarefa encontrada ou null
     */
    async execute(id) {
        if (!id) throw new AppError('ID da tarefa é obrigatório', 400);

        const taskId = parseInt(id, 10);
        if (isNaN(taskId)) throw new AppError('ID da tarefa deve ser um número', 400);

        return tasks.find(task => task.id === taskId);
    }
}

module.exports = new GetTaskByIdService(); 