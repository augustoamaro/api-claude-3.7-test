/**
 * API.js - Módulo para interação com a API de tarefas
 * 
 * Este módulo encapsula todas as chamadas à API de tarefas,
 * fornecendo uma interface limpa para o restante da aplicação.
 * Implementado em estilo funcional.
 */

// URL base da API
const API_URL = 'http://localhost:3000/api/tasks';

/**
 * Busca todas as tarefas
 * @returns {Promise<Array>} Lista de tarefas
 */
async function getAllTasks() {
    try {
        const response = await fetch(API_URL);

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
        const response = await fetch(`${API_URL}/${id}`);

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
        const response = await fetch(API_URL, {
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
        const response = await fetch(`${API_URL}/${id}`, {
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
        const response = await fetch(`${API_URL}/${id}`, {
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

// Exportar funções para uso global
window.api = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
}; 