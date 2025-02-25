const updateCategoryService = require('../../services/category/UpdateCategoryService');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');

/**
 * Controlador responsável por atualizar uma categoria
 */
class UpdateCategoryController {
    /**
     * Manipula a requisição para atualizar uma categoria
     */
    handle = catchAsync(async (req, res, next) => {
        const category = await updateCategoryService.execute(req.params.id, req.body);

        if (!category) {
            return next(new AppError('Categoria não encontrada', 404));
        }

        res.status(200).json({
            status: 'success',
            data: { category }
        });
    });
}

module.exports = new UpdateCategoryController(); 