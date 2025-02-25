const express = require('express');
const router = express.Router();

// Importar controladores com responsabilidade única
const createCategoryController = require('../controllers/category/CreateCategoryController');
const getAllCategoriesController = require('../controllers/category/GetAllCategoriesController');
const getCategoryByIdController = require('../controllers/category/GetCategoryByIdController');
const updateCategoryController = require('../controllers/category/UpdateCategoryController');
const deleteCategoryController = require('../controllers/category/DeleteCategoryController');

/**
 * @route   GET /api/categories
 * @desc    Obter todas as categorias
 * @access  Público
 */
router.get('/', getAllCategoriesController.handle);

/**
 * @route   GET /api/categories/:id
 * @desc    Obter uma categoria pelo ID
 * @access  Público
 */
router.get('/:id', getCategoryByIdController.handle);

/**
 * @route   POST /api/categories
 * @desc    Criar uma nova categoria
 * @access  Público
 */
router.post('/', createCategoryController.handle);

/**
 * @route   PUT /api/categories/:id
 * @desc    Atualizar uma categoria existente
 * @access  Público
 */
router.put('/:id', updateCategoryController.handle);

/**
 * @route   DELETE /api/categories/:id
 * @desc    Remover uma categoria
 * @access  Público
 */
router.delete('/:id', deleteCategoryController.handle);

module.exports = router; 