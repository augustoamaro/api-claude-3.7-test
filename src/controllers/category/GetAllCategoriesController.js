const getAllCategoriesService = require('../../services/category/GetAllCategoriesService');
const catchAsync = require('../../utils/catchAsync');

/**
 * Controlador responsável por listar todas as categorias
 */
class GetAllCategoriesController {
    /**
     * Manipula a requisição para listar todas as categorias
     */
    handle = catchAsync(async (req, res) => {
        const categories = await getAllCategoriesService.execute();

        res.status(200).json({
            status: 'success',
            results: categories.length,
            data: { categories }
        });
    });
}

module.exports = new GetAllCategoriesController(); 