const createCategoryService = require('../../services/category/CreateCategoryService');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');

/**
 * Controlador responsável pela criação de categorias
 */
class CreateCategoryController {
    /**
     * Manipula a requisição para criar uma nova categoria
     */
    handle = catchAsync(async (req, res, next) => {
        const { name, color } = req.body;

        if (!name) {
            return next(new AppError('Nome da categoria é obrigatório', 400));
        }

        if (!color) {
            return next(new AppError('Cor da categoria é obrigatória', 400));
        }

        const newCategory = await createCategoryService.execute(name, color);

        res.status(201).json({
            status: 'success',
            data: { category: newCategory }
        });
    });
}

module.exports = new CreateCategoryController(); 