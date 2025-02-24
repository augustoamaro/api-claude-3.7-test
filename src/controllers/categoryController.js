const categoryService = require('../services/categoryService');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const getAllCategories = catchAsync(async (req, res) => {
    const categories = await categoryService.getAllCategories();
    res.status(200).json({
        status: 'success',
        results: categories.length,
        data: { categories }
    });
});

const getCategoryById = catchAsync(async (req, res, next) => {
    const category = await categoryService.getCategoryById(req.params.id);
    if (!category) {
        return next(new AppError('Categoria não encontrada', 404));
    }
    res.status(200).json({
        status: 'success',
        data: { category }
    });
});

const createCategory = catchAsync(async (req, res, next) => {
    const { name, color } = req.body;

    if (!name) {
        return next(new AppError('Nome da categoria é obrigatório', 400));
    }

    if (!color) {
        return next(new AppError('Cor da categoria é obrigatória', 400));
    }

    const newCategory = await categoryService.createCategory(name, color);

    res.status(201).json({
        status: 'success',
        data: { category: newCategory }
    });
});

const updateCategory = catchAsync(async (req, res, next) => {
    const category = await categoryService.updateCategory(req.params.id, req.body);

    if (!category) {
        return next(new AppError('Categoria não encontrada', 404));
    }

    res.status(200).json({
        status: 'success',
        data: { category }
    });
});

const deleteCategory = catchAsync(async (req, res, next) => {
    const category = await categoryService.deleteCategory(req.params.id);

    if (!category) {
        return next(new AppError('Categoria não encontrada', 404));
    }

    res.status(200).json({
        status: 'success',
        data: null
    });
});

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
}; 