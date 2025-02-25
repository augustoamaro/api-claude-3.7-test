const { tasks } = require('../../models/taskModel');
const AppError = require('../../utils/appError');

/**
 * Serviço responsável por atualizar o status de várias tarefas
 */
class BulkUpdateTaskStatusService {
    /**
     * Marca várias tarefas como concluídas ou pendentes
     * @param {Array<number>} ids - IDs das tarefas
     * @param {boolean} completed - Status de conclusão
     * @returns {Promise<Array>} Tarefas atualizadas
     */
    async execute(ids, completed) {
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
    }
}

module.exports = new BulkUpdateTaskStatusService(); 