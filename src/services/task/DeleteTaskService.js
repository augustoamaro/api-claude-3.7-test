const { tasks } = require('../../models/taskModel');
const AppError = require('../../utils/appError');

/**
 * Serviço responsável por excluir uma tarefa
 */
class DeleteTaskService {
    /**
     * Remove uma tarefa
     * @param {string|number} id - ID da tarefa
     * @returns {Promise<Object|null>} Tarefa removida ou null
     */
    async execute(id) {
        if (!id) throw new AppError('ID da tarefa é obrigatório', 400);

        const taskId = parseInt(id, 10);
        if (isNaN(taskId)) throw new AppError('ID da tarefa deve ser um número', 400);

        const taskIndex = tasks.findIndex(task => task.id === taskId);
        if (taskIndex === -1) return null;

        return tasks.splice(taskIndex, 1)[0];
    }
}

module.exports = new DeleteTaskService(); 