const { categories } = require('../../models/taskModel');

/**
 * Serviço responsável por listar todas as categorias
 */
class GetAllCategoriesService {
    /**
     * Retorna todas as categorias
     * @returns {Promise<Array>} Lista de categorias
     */
    async execute() {
        return categories;
    }
}

module.exports = new GetAllCategoriesService(); 