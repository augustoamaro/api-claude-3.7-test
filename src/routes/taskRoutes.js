const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

/**
 * @route   GET /api/tasks
 * @desc    Obter todas as tarefas
 * @access  Público
 */
router.get('/', taskController.getAllTasks);

/**
 * @route   GET /api/tasks/:id
 * @desc    Obter uma tarefa pelo ID
 * @access  Público
 */
router.get('/:id', taskController.getTaskById);

/**
 * @route   POST /api/tasks
 * @desc    Criar uma nova tarefa
 * @access  Público
 */
router.post('/', taskController.createTask);

/**
 * @route   PUT /api/tasks/:id
 * @desc    Atualizar uma tarefa existente
 * @access  Público
 */
router.put('/:id', taskController.updateTask);

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Remover uma tarefa
 * @access  Público
 */
router.delete('/:id', taskController.deleteTask);

module.exports = router;