const { categories, getNextCategoryId, validateCategory } = require('../../models/taskModel');
const AppError = require('../../utils/appError');

/**
 * Serviço responsável pela criação de categorias
 */
class CreateCategoryService {
    /**
     * Cria uma nova categoria
     * @param {string} name - Nome da categoria
     * @param {string} color - Cor da categoria (formato hexadecimal)
     * @returns {Promise<Object>} Categoria criada
     */
    async execute(name, color) {
        const categoryData = { name, color };
        const validation = validateCategory(categoryData);

        if (!validation.isValid) {
            throw new AppError(validation.errors.join(', '), 400);
        }

        // Verificar se já existe uma categoria com o mesmo nome
        const existingCategory = categories.find(
            category => category.name.toLowerCase() === name.toLowerCase()
        );

        if (existingCategory) {
            throw new AppError('Já existe uma categoria com este nome', 400);
        }

        const newCategory = {
            id: getNextCategoryId(),
            name,
            color,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        categories.push(newCategory);
        return newCategory;
    }
}

module.exports = new CreateCategoryService(); 