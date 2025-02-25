const getTaskByIdService = require('../../services/task/GetTaskByIdService');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');

/**
 * Controlador responsável por buscar uma tarefa pelo ID
 */
class GetTaskByIdController {
    /**
     * Manipula a requisição para buscar uma tarefa pelo ID
     */
    handle = catchAsync(async (req, res, next) => {
        const task = await getTaskByIdService.execute(req.params.id);

        if (!task) {
            return next(new AppError('Task not found', 404));
        }

        res.status(200).json({
            status: 'success',
            data: { task }
        });
    });
}

module.exports = new GetTaskByIdController(); 