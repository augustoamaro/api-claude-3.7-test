const { categories, validateCategory } = require('../../models/taskModel');
const AppError = require('../../utils/appError');

/**
 * Serviço responsável por atualizar uma categoria
 */
class UpdateCategoryService {
    /**
     * Atualiza uma categoria existente
     * @param {string|number} id - ID da categoria
     * @param {Object} updates - Campos a serem atualizados
     * @returns {Promise<Object|null>} Categoria atualizada ou null
     */
    async execute(id, updates) {
        if (!id) throw new AppError('ID da categoria é obrigatório', 400);

        const categoryId = parseInt(id, 10);
        if (isNaN(categoryId)) throw new AppError('ID da categoria deve ser um número', 400);

        // Validar os dados de atualização
        const validation = validateCategory(updates);
        if (!validation.isValid) {
            throw new AppError(validation.errors.join(', '), 400);
        }

        const category = categories.find(category => category.id === categoryId);
        if (!category) return null;

        // Verificar se já existe outra categoria com o mesmo nome
        if (updates.name) {
            const existingCategory = categories.find(
                c => c.id !== categoryId && c.name.toLowerCase() === updates.name.toLowerCase()
            );

            if (existingCategory) {
                throw new AppError('Já existe uma categoria com este nome', 400);
            }
        }

        // Não permitir atualização de campos protegidos
        const safeUpdates = { ...updates };
        delete safeUpdates.id;
        delete safeUpdates.createdAt;

        // Atualizar a categoria
        Object.assign(category, safeUpdates, { updatedAt: new Date() });
        return category;
    }
}

module.exports = new UpdateCategoryService(); 