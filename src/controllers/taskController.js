const taskService = require('../services/taskService');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const getAllTasks = catchAsync(async (req, res) => {
    const tasks = await taskService.getAllTasks();
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
    const { title, description } = req.body;

    if (!title) {
        return next(new AppError('Title is required', 400));
    }

    const newTask = await taskService.createTask(title, description);

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

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
};