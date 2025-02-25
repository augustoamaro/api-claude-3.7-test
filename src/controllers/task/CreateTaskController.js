const createTaskService = require('../../services/task/CreateTaskService');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');

/**
 * Controlador responsável pela criação de tarefas
 */
class CreateTaskController {
    /**
     * Manipula a requisição para criar uma nova tarefa
     */
    handle = catchAsync(async (req, res, next) => {
        const { title, description, priority, categoryId, dueDate, tags } = req.body;

        if (!title) {
            return next(new AppError('Title is required', 400));
        }

        const additionalData = { priority, categoryId, dueDate, tags };
        const newTask = await createTaskService.execute(title, description, additionalData);

        res.status(201).json({
            status: 'success',
            data: { task: newTask }
        });
    });
}

module.exports = new CreateTaskController(); 