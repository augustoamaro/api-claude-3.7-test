const express = require('express');
const router = express.Router();

// Importar controladores com responsabilidade única
const createTaskController = require('../controllers/task/CreateTaskController');
const getAllTasksController = require('../controllers/task/GetAllTasksController');
const getTaskByIdController = require('../controllers/task/GetTaskByIdController');
const updateTaskController = require('../controllers/task/UpdateTaskController');
const deleteTaskController = require('../controllers/task/DeleteTaskController');
const bulkUpdateTaskStatusController = require('../controllers/task/BulkUpdateTaskStatusController');
const getTaskStatsController = require('../controllers/task/GetTaskStatsController');

/**
 * @route   GET /api/tasks
 * @desc    Obter todas as tarefas
 * @access  Público
 */
router.get('/', getAllTasksController.handle);

/**
 * @route   GET /api/tasks/stats
 * @desc    Obter estatísticas das tarefas
 * @access  Público
 */
router.get('/stats', getTaskStatsController.handle);

/**
 * @route   GET /api/tasks/:id
 * @desc    Obter uma tarefa pelo ID
 * @access  Público
 */
router.get('/:id', getTaskByIdController.handle);

/**
 * @route   POST /api/tasks
 * @desc    Criar uma nova tarefa
 * @access  Público
 */
router.post('/', createTaskController.handle);

/**
 * @route   POST /api/tasks/bulk-update
 * @desc    Atualizar o status de várias tarefas
 * @access  Público
 */
router.post('/bulk-update', bulkUpdateTaskStatusController.handle);

/**
 * @route   PUT /api/tasks/:id
 * @desc    Atualizar uma tarefa existente
 * @access  Público
 */
router.put('/:id', updateTaskController.handle);

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Remover uma tarefa
 * @access  Público
 */
router.delete('/:id', deleteTaskController.handle);

module.exports = router;