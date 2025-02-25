const bulkUpdateTaskStatusService = require('../../services/task/BulkUpdateTaskStatusService');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');

/**
 * Controlador responsável por atualizar o status de várias tarefas
 */
class BulkUpdateTaskStatusController {
    /**
     * Manipula a requisição para atualizar o status de várias tarefas
     */
    handle = catchAsync(async (req, res, next) => {
        const { ids, completed } = req.body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return next(new AppError('É necessário fornecer um array de IDs de tarefas', 400));
        }

        if (completed === undefined) {
            return next(new AppError('É necessário fornecer o status de conclusão (completed)', 400));
        }

        const tasks = await bulkUpdateTaskStatusService.execute(ids, completed);

        res.status(200).json({
            status: 'success',
            results: tasks.length,
            data: { tasks }
        });
    });
}

module.exports = new BulkUpdateTaskStatusController(); 