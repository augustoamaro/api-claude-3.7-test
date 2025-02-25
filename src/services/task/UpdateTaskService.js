const { tasks, validateTask } = require('../../models/taskModel');
const AppError = require('../../utils/appError');

/**
 * Serviço responsável por atualizar uma tarefa
 */
class UpdateTaskService {
    /**
     * Atualiza uma tarefa existente
     * @param {string|number} id - ID da tarefa
     * @param {Object} updates - Campos a serem atualizados
     * @returns {Promise<Object|null>} Tarefa atualizada ou null
     */
    async execute(id, updates) {
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
    }
}

module.exports = new UpdateTaskService(); 