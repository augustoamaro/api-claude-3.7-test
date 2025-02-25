const { tasks } = require('../../models/taskModel');

/**
 * Serviço responsável por listar todas as tarefas
 */
class GetAllTasksService {
    /**
     * Retorna todas as tarefas com filtros aplicados
     * @param {Object} filters - Filtros para as tarefas
     * @returns {Promise<Array>} Lista de tarefas
     */
    async execute(filters = {}) {
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
    }
}

module.exports = new GetAllTasksService(); 