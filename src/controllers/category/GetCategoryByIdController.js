const getCategoryByIdService = require('../../services/category/GetCategoryByIdService');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');

/**
 * Controlador responsável por buscar uma categoria pelo ID
 */
class GetCategoryByIdController {
    /**
     * Manipula a requisição para buscar uma categoria pelo ID
     */
    handle = catchAsync(async (req, res, next) => {
        const category = await getCategoryByIdService.execute(req.params.id);

        if (!category) {
            return next(new AppError('Categoria não encontrada', 404));
        }

        res.status(200).json({
            status: 'success',
            data: { category }
        });
    });
}

module.exports = new GetCategoryByIdController(); 