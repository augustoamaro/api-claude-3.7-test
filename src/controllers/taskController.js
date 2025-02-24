const taskService = require('../services/taskService');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const getAllTasks = catchAsync(async (req, res) => {
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

    const tasks = await taskService.getAllTasks(filters);
    res.status(200).json({
        status: 'success',
        results: tasks.length,
        data: { tasks }
    });
});

const getTaskById = catchAsync(async (req, res, next) => {
    const task = await taskService.getTaskById(req.params.id);
    if (!task) {
        return next(new AppError('Task not found', 404));
    }
    res.status(200).json({
        status: 'success',
        data: { task }
    });
});

const createTask = catchAsync(async (req, res, next) => {
    const { title, description, priority, categoryId, dueDate, tags } = req.body;

    if (!title) {
        return next(new AppError('Title is required', 400));
    }

    const additionalData = { priority, categoryId, dueDate, tags };
    const newTask = await taskService.createTask(title, description, additionalData);

    res.status(201).json({
        status: 'success',
        data: { task: newTask }
    });
});

const updateTask = catchAsync(async (req, res, next) => {
    const task = await taskService.updateTask(req.params.id, req.body);

    if (!task) {
        return next(new AppError('Task not found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: { task }
    });
});

const deleteTask = catchAsync(async (req, res, next) => {
    const task = await taskService.deleteTask(req.params.id);

    if (!task) {
        return next(new AppError('Task not found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: null
    });
});

const bulkUpdateTaskStatus = catchAsync(async (req, res, next) => {
    const { ids, completed } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return next(new AppError('IDs das tarefas são obrigatórios', 400));
    }

    if (completed === undefined) {
        return next(new AppError('Status de conclusão é obrigatório', 400));
    }

    const updatedTasks = await taskService.bulkUpdateTaskStatus(ids, completed);

    res.status(200).json({
        status: 'success',
        results: updatedTasks.length,
        data: { tasks: updatedTasks }
    });
});

const getTaskStats = catchAsync(async (req, res) => {
    const stats = await taskService.getTaskStats();

    res.status(200).json({
        status: 'success',
        data: { stats }
    });
});

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    bulkUpdateTaskStatus,
    getTaskStats
};