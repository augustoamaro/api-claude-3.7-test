const { tasks } = require('../../models/taskModel');

/**
 * Serviço responsável por obter estatísticas das tarefas
 */
class GetTaskStatsService {
    /**
     * Obtém estatísticas das tarefas
     * @returns {Promise<Object>} Estatísticas
     */
    async execute() {
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
    }
}

module.exports = new GetTaskStatsService(); 