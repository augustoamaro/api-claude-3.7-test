const getAllTasksService = require('../../services/task/GetAllTasksService');
const catchAsync = require('../../utils/catchAsync');

/**
 * Controlador responsável por listar todas as tarefas
 */
class GetAllTasksController {
    /**
     * Manipula a requisição para listar todas as tarefas
     */
    handle = catchAsync(async (req, res) => {
        // Extrair filtros da query string
        const filters = {
            completed: req.query.completed,
            priority: req.query.priority,
            categoryId: req.query.categoryId,
            search: req.query.search,
            dueBefore: req.query.dueBefore,
            dueAfter: req.query.dueAfter,
            sortBy: req.query.sortBy,
            sortOrder: req.query.sortOrder
        };

        const tasks = await getAllTasksService.execute(filters);

        res.status(200).json({
            status: 'success',
            results: tasks.length,
            data: { tasks }
        });
    });
}

module.exports = new GetAllTasksController(); 