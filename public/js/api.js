/**
 * API.js - Módulo para interação com a API de tarefas
 * 
 * Este módulo encapsula todas as chamadas à API de tarefas,
 * fornecendo uma interface limpa para o restante da aplicação.
 * Implementado em estilo funcional.
 */

// URL base da API
const API_URL = 'http://localhost:3000/api';

/**
 * Busca todas as tarefas
 * @param {Object} filters - Filtros para as tarefas
 * @returns {Promise<Array>} Lista de tarefas
 */
async function getAllTasks(filters = {}) {
    try {
        // Construir query string a partir dos filtros
        const queryParams = new URLSearchParams();

        for (const [key, value] of Object.entries(filters)) {
            if (value !== undefined && value !== null && value !== '') {
                queryParams.append(key, value);
            }
        }

        const queryString = queryParams.toString();
        const url = queryString ? `${API_URL}/tasks?${queryString}` : `${API_URL}/tasks`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Erro ao buscar tarefas: ${response.status}`);
        }

        const data = await response.json();
        return data.data.tasks;
    } catch (error) {
        console.error('Erro na API:', error);
        throw error;
    }
}

/**
 * Busca uma tarefa pelo ID
 * @param {number} id - ID da tarefa
 * @returns {Promise<Object>} Tarefa encontrada
 */
async function getTaskById(id) {
    try {
        const response = await fetch(`${API_URL}/tasks/${id}`);

        if (!response.ok) {
            throw new Error(`Erro ao buscar tarefa: ${response.status}`);
        }

        const data = await response.json();
        return data.data.task;
    } catch (error) {
        console.error('Erro na API:', error);
        throw error;
    }
}

/**
 * Cria uma nova tarefa
 * @param {Object} taskData - Dados da tarefa
 * @returns {Promise<Object>} Tarefa criada
 */
async function createTask(taskData) {
    try {
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Erro ao criar tarefa: ${response.status}`);
        }

        const data = await response.json();
        return data.data.task;
    } catch (error) {
        console.error('Erro na API:', error);
        throw error;
    }
}

/**
 * Atualiza uma tarefa existente
 * @param {number} id - ID da tarefa
 * @param {Object} taskData - Dados atualizados da tarefa
 * @returns {Promise<Object>} Tarefa atualizada
 */
async function updateTask(id, taskData) {
    try {
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Erro ao atualizar tarefa: ${response.status}`);
        }

        const data = await response.json();
        return data.data.task;
    } catch (error) {
        console.error('Erro na API:', error);
        throw error;
    }
}

/**
 * Remove uma tarefa
 * @param {number} id - ID da tarefa
 * @returns {Promise<boolean>} Sucesso da operação
 */
async function deleteTask(id) {
    try {
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Erro ao excluir tarefa: ${response.status}`);
        }

        return true;
    } catch (error) {
        console.error('Erro na API:', error);
        throw error;
    }
}

/**
 * Atualiza o status de várias tarefas
 * @param {Array<number>} ids - IDs das tarefas
 * @param {boolean} completed - Status de conclusão
 * @returns {Promise<Array>} Tarefas atualizadas
 */
async function bulkUpdateTaskStatus(ids, completed) {
    try {
        const response = await fetch(`${API_URL}/tasks/bulk-update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ids, completed })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Erro ao atualizar tarefas: ${response.status}`);
        }

        const data = await response.json();
        return data.data.tasks;
    } catch (error) {
        console.error('Erro na API:', error);
        throw error;
    }
}

/**
 * Obtém estatísticas das tarefas
 * @returns {Promise<Object>} Estatísticas
 */
async function getTaskStats() {
    try {
        const response = await fetch(`${API_URL}/tasks/stats`);

        if (!response.ok) {
            throw new Error(`Erro ao buscar estatísticas: ${response.status}`);
        }

        const data = await response.json();
        return data.data.stats;
    } catch (error) {
        console.error('Erro na API:', error);
        throw error;
    }
}

/**
 * Busca todas as categorias
 * @returns {Promise<Array>} Lista de categorias
 */
async function getAllCategories() {
    try {
        const response = await fetch(`${API_URL}/categories`);

        if (!response.ok) {
            throw new Error(`Erro ao buscar categorias: ${response.status}`);
        }

        const data = await response.json();
        return data.data.categories;
    } catch (error) {
        console.error('Erro na API:', error);
        throw error;
    }
}

/**
 * Cria uma nova categoria
 * @param {Object} categoryData - Dados da categoria
 * @returns {Promise<Object>} Categoria criada
 */
async function createCategory(categoryData) {
    try {
        const response = await fetch(`${API_URL}/categories`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(categoryData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Erro ao criar categoria: ${response.status}`);
        }

        const data = await response.json();
        return data.data.category;
    } catch (error) {
        console.error('Erro na API:', error);
        throw error;
    }
}

/**
 * Atualiza uma categoria existente
 * @param {number} id - ID da categoria
 * @param {Object} categoryData - Dados atualizados da categoria
 * @returns {Promise<Object>} Categoria atualizada
 */
async function updateCategory(id, categoryData) {
    try {
        const response = await fetch(`${API_URL}/categories/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(categoryData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Erro ao atualizar categoria: ${response.status}`);
        }

        const data = await response.json();
        return data.data.category;
    } catch (error) {
        console.error('Erro na API:', error);
        throw error;
    }
}

/**
 * Remove uma categoria
 * @param {number} id - ID da categoria
 * @returns {Promise<boolean>} Sucesso da operação
 */
async function deleteCategory(id) {
    try {
        const response = await fetch(`${API_URL}/categories/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Erro ao excluir categoria: ${response.status}`);
        }

        return true;
    } catch (error) {
        console.error('Erro na API:', error);
        throw error;
    }
}

// Exportar funções para uso global
window.getAllTasks = getAllTasks;
window.getTaskById = getTaskById;
window.createTask = createTask;
window.updateTask = updateTask;
window.deleteTask = deleteTask;
window.bulkUpdateTaskStatus = bulkUpdateTaskStatus;
window.getTaskStats = getTaskStats;
window.getAllCategories = getAllCategories;
window.createCategory = createCategory;
window.updateCategory = updateCategory;
window.deleteCategory = deleteCategory; 