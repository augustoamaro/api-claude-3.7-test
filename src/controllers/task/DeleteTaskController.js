const deleteTaskService = require('../../services/task/DeleteTaskService');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');

/**
 * Controlador responsável por excluir uma tarefa
 */
class DeleteTaskController {
    /**
     * Manipula a requisição para excluir uma tarefa
     */
    handle = catchAsync(async (req, res, next) => {
        const task = await deleteTaskService.execute(req.params.id);

        if (!task) {
            return next(new AppError('Task not found', 404));
        }

        res.status(200).json({
            status: 'success',
            data: null
        });
    });
}

module.exports = new DeleteTaskController(); 