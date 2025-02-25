const updateTaskService = require('../../services/task/UpdateTaskService');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');

/**
 * Controlador responsável por atualizar uma tarefa
 */
class UpdateTaskController {
    /**
     * Manipula a requisição para atualizar uma tarefa
     */
    handle = catchAsync(async (req, res, next) => {
        const task = await updateTaskService.execute(req.params.id, req.body);

        if (!task) {
            return next(new AppError('Task not found', 404));
        }

        res.status(200).json({
            status: 'success',
            data: { task }
        });
    });
}

module.exports = new UpdateTaskController(); 