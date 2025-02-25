const { categories } = require('../../models/taskModel');
const AppError = require('../../utils/appError');

/**
 * Serviço responsável por excluir uma categoria
 */
class DeleteCategoryService {
    /**
     * Remove uma categoria
     * @param {string|number} id - ID da categoria
     * @returns {Promise<Object|null>} Categoria removida ou null
     */
    async execute(id) {
        if (!id) throw new AppError('ID da categoria é obrigatório', 400);

        const categoryId = parseInt(id, 10);
        if (isNaN(categoryId)) throw new AppError('ID da categoria deve ser um número', 400);

        const categoryIndex = categories.findIndex(category => category.id === categoryId);
        if (categoryIndex === -1) return null;

        return categories.splice(categoryIndex, 1)[0];
    }
}

module.exports = new DeleteCategoryService(); 