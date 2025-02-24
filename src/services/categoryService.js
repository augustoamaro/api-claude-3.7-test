const { categories, getNextCategoryId, validateCategory } = require('../models/taskModel');
const AppError = require('../utils/appError');

/**
 * Retorna todas as categorias
 * @returns {Promise<Array>} Lista de categorias
 */
const getAllCategories = async () => {
    return categories;
};

/**
 * Busca uma categoria pelo ID
 * @param {string|number} id - ID da categoria
 * @returns {Promise<Object|null>} Categoria encontrada ou null
 */
const getCategoryById = async (id) => {
    if (!id) throw new AppError('ID da categoria é obrigatório', 400);

    const categoryId = parseInt(id, 10);
    if (isNaN(categoryId)) throw new AppError('ID da categoria deve ser um número', 400);

    return categories.find(category => category.id === categoryId);
};

/**
 * Cria uma nova categoria
 * @param {string} name - Nome da categoria
 * @param {string} color - Cor da categoria (formato hexadecimal)
 * @returns {Promise<Object>} Categoria criada
 */
const createCategory = async (name, color) => {
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
};

/**
 * Atualiza uma categoria existente
 * @param {string|number} id - ID da categoria
 * @param {Object} updates - Campos a serem atualizados
 * @returns {Promise<Object|null>} Categoria atualizada ou null
 */
const updateCategory = async (id, updates) => {
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
};

/**
 * Remove uma categoria
 * @param {string|number} id - ID da categoria
 * @returns {Promise<Object|null>} Categoria removida ou null
 */
const deleteCategory = async (id) => {
    if (!id) throw new AppError('ID da categoria é obrigatório', 400);

    const categoryId = parseInt(id, 10);
    if (isNaN(categoryId)) throw new AppError('ID da categoria deve ser um número', 400);

    const categoryIndex = categories.findIndex(category => category.id === categoryId);
    if (categoryIndex === -1) return null;

    return categories.splice(categoryIndex, 1)[0];
};

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
}; 