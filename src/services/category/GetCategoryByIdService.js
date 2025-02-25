const { categories } = require('../../models/taskModel');
const AppError = require('../../utils/appError');

/**
 * Serviço responsável por buscar uma categoria pelo ID
 */
class GetCategoryByIdService {
    /**
     * Busca uma categoria pelo ID
     * @param {string|number} id - ID da categoria
     * @returns {Promise<Object|null>} Categoria encontrada ou null
     */
    async execute(id) {
        if (!id) throw new AppError('ID da categoria é obrigatório', 400);

        const categoryId = parseInt(id, 10);
        if (isNaN(categoryId)) throw new AppError('ID da categoria deve ser um número', 400);

        return categories.find(category => category.id === categoryId);
    }
}

module.exports = new GetCategoryByIdService(); 