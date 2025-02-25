const deleteCategoryService = require('../../services/category/DeleteCategoryService');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');

/**
 * Controlador responsável por excluir uma categoria
 */
class DeleteCategoryController {
    /**
     * Manipula a requisição para excluir uma categoria
     */
    handle = catchAsync(async (req, res, next) => {
        const category = await deleteCategoryService.execute(req.params.id);

        if (!category) {
            return next(new AppError('Categoria não encontrada', 404));
        }

        res.status(200).json({
            status: 'success',
            data: null
        });
    });
}

module.exports = new DeleteCategoryController(); 