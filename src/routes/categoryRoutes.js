const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

/**
 * @route   GET /api/categories
 * @desc    Obter todas as categorias
 * @access  Público
 */
router.get('/', categoryController.getAllCategories);

/**
 * @route   GET /api/categories/:id
 * @desc    Obter uma categoria pelo ID
 * @access  Público
 */
router.get('/:id', categoryController.getCategoryById);

/**
 * @route   POST /api/categories
 * @desc    Criar uma nova categoria
 * @access  Público
 */
router.post('/', categoryController.createCategory);

/**
 * @route   PUT /api/categories/:id
 * @desc    Atualizar uma categoria existente
 * @access  Público
 */
router.put('/:id', categoryController.updateCategory);

/**
 * @route   DELETE /api/categories/:id
 * @desc    Remover uma categoria
 * @access  Público
 */
router.delete('/:id', categoryController.deleteCategory);

module.exports = router; 