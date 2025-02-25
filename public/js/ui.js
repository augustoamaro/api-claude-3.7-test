/**
 * UI.js - Módulo para gerenciar a interface do usuário
 * 
 * Este módulo encapsula todas as operações relacionadas à interface,
 * como renderização de elementos, manipulação do DOM e animações.
 * Implementado em estilo funcional.
 */

// Estado da aplicação
const state = {
    questList: null,
    questTemplate: null,
    questModal: null,
    overlay: null,
    questForm: null,
    modalTitle: null,
    addQuestBtn: null,
    closeModalBtn: null,
    cancelBtn: null,
    filterSelect: null,
    notificationContainer: null,
    completedCount: null,
    pendingCount: null,
    achievementsCount: null,
    xpRemaining: null,
    achievements: {},
    currentFilter: 'all',
    tasks: [],
    categories: [], // Armazenar categorias
    playerStats: {
        level: 1,
        xp: 25,
        xpToNextLevel: 100,
        completedTasks: 0,
        achievements: 0
    }
};

/**
 * Inicializa a interface do usuário
 */
function init() {
    // Elementos do DOM
    state.questList = document.getElementById('quest-list');
    state.questTemplate = document.getElementById('quest-template');
    state.questModal = document.getElementById('quest-modal');
    state.overlay = document.getElementById('overlay');
    state.questForm = document.getElementById('quest-form');
    state.modalTitle = document.getElementById('modal-title');
    state.addQuestBtn = document.getElementById('add-quest-btn');
    state.closeModalBtn = document.getElementById('close-modal');
    state.cancelBtn = document.getElementById('cancel-btn');
    state.filterSelect = document.getElementById('filter-quests');
    state.notificationContainer = document.getElementById('notification-container');

    // Estatísticas
    state.completedCount = document.getElementById('completed-count');
    state.pendingCount = document.getElementById('pending-count');
    state.achievementsCount = document.getElementById('achievements-count');
    state.xpRemaining = document.getElementById('xp-remaining');

    // Conquistas
    state.achievements = {
        firstQuest: document.getElementById('achievement-1'),
        organizer: document.getElementById('achievement-2'),
        productive: document.getElementById('achievement-3')
    };

    // Configurar eventos
    setupEventListeners();

    // Atualizar informações de XP
    updateXPBar();
    updateXPRemaining();

    // Carregar categorias
    loadCategories();
}

/**
 * Configura os listeners de eventos
 */
function setupEventListeners() {
    // Abrir modal para nova tarefa
    state.addQuestBtn.addEventListener('click', () => {
        openModal();
    });

    // Fechar modal
    state.closeModalBtn.addEventListener('click', () => {
        closeModal();
    });

    state.cancelBtn.addEventListener('click', () => {
        closeModal();
    });

    state.overlay.addEventListener('click', () => {
        closeModal();
    });

    // Filtrar tarefas
    state.filterSelect.addEventListener('change', (e) => {
        state.currentFilter = e.target.value;
        renderTasks();
    });

    // Submeter formulário
    state.questForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleFormSubmit();
    });

    // Botão de adicionar categoria
    const addCategoryBtn = document.getElementById('add-category-btn');
    if (addCategoryBtn) {
        addCategoryBtn.addEventListener('click', () => {
            openCategoryModal();
        });
    }

    // Fechar modal de categoria
    const closeCategoryBtn = document.getElementById('close-category-modal');
    if (closeCategoryBtn) {
        closeCategoryBtn.addEventListener('click', () => {
            closeCategoryModal();
        });
    }

    // Cancelar criação de categoria
    const cancelCategoryBtn = document.getElementById('cancel-category-btn');
    if (cancelCategoryBtn) {
        cancelCategoryBtn.addEventListener('click', () => {
            closeCategoryModal();
        });
    }

    // Submeter formulário de categoria
    const categoryForm = document.getElementById('category-form');
    if (categoryForm) {
        categoryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleCategoryFormSubmit();
        });
    }
}

/**
 * Abre o modal para adicionar/editar tarefa
 * @param {Object} task - Tarefa a ser editada (opcional)
 */
function openModal(task = null) {
    const titleInput = document.getElementById('quest-title');
    const descriptionInput = document.getElementById('quest-description');
    const idInput = document.getElementById('quest-id');
    const priorityInput = document.getElementById('quest-priority');
    const categoryInput = document.getElementById('quest-category');
    const dueDateInput = document.getElementById('quest-due-date');
    const tagsInput = document.getElementById('quest-tags');

    // Limpar formulário
    state.questForm.reset();

    if (task) {
        // Modo de edição
        state.modalTitle.textContent = 'Editar Missão';
        titleInput.value = task.title;
        descriptionInput.value = task.description || '';
        idInput.value = task.id;

        // Preencher campos adicionais
        if (task.priority) {
            priorityInput.value = task.priority;
        }

        if (task.categoryId) {
            categoryInput.value = task.categoryId;
        }

        if (task.dueDate) {
            dueDateInput.value = task.dueDate;
        }

        if (task.tags && Array.isArray(task.tags)) {
            tagsInput.value = task.tags.join(', ');
        }
    } else {
        // Modo de criação
        state.modalTitle.textContent = 'Nova Missão';
        idInput.value = '';
    }

    // Mostrar modal
    state.questModal.classList.add('active');
    state.overlay.classList.add('active');

    // Focar no título
    setTimeout(() => {
        titleInput.focus();
    }, 100);
}

/**
 * Fecha o modal
 */
function closeModal() {
    state.questModal.classList.remove('active');
    state.overlay.classList.remove('active');
}

/**
 * Atualiza uma tarefa existente na interface
 * @param {Object} updatedTask - Dados atualizados da tarefa
 */
function updateTaskInUI(updatedTask) {
    const index = state.tasks.findIndex(task => task.id === updatedTask.id);

    if (index !== -1) {
        state.tasks[index] = updatedTask;
        renderTasks();
        updateStats();
    }
}

/**
 * Manipula o envio do formulário
 */
async function handleFormSubmit() {
    const titleInput = document.getElementById('quest-title');
    const descriptionInput = document.getElementById('quest-description');
    const idInput = document.getElementById('quest-id');
    const priorityInput = document.getElementById('quest-priority');
    const categoryInput = document.getElementById('quest-category');
    const dueDateInput = document.getElementById('quest-due-date');
    const tagsInput = document.getElementById('quest-tags');

    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    const id = idInput.value;
    const priority = priorityInput.value;
    const categoryId = categoryInput.value;
    const dueDate = dueDateInput.value;
    const tags = tagsInput.value.trim() ? tagsInput.value.split(',').map(tag => tag.trim()) : [];

    if (!title) {
        showNotification('O título da missão é obrigatório', 'error');
        return;
    }

    try {
        const taskData = {
            title,
            description,
            priority,
            categoryId,
            dueDate,
            tags
        };

        if (id) {
            // Atualizar tarefa existente
            const updatedTask = await window.updateTask(id, taskData);
            updateTaskInUI(updatedTask);
            showNotification('Missão atualizada com sucesso!', 'success');
        } else {
            // Criar nova tarefa
            const newTask = await window.createTask(taskData);
            addTask(newTask);
            showNotification('Nova missão adicionada!', 'success');

            // Verificar conquista: Primeira Missão
            if (state.tasks.length === 1) {
                unlockAchievement('firstQuest', 'Primeira Missão');
            }

            // Verificar conquista: Mestre Organizador
            if (state.tasks.length >= 5) {
                unlockAchievement('organizer', 'Mestre Organizador');
            }
        }

        closeModal();
        // Atualizar a contagem de tarefas por categoria
        loadCategories();
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

/**
 * Carrega as tarefas da API
 */
async function loadTasks() {
    try {
        showLoading();
        const tasks = await window.getAllTasks();
        state.tasks = tasks;
        console.log('Tarefas carregadas:', tasks);
        renderTasks();
        updateStats();

        // Atualizar contadores de categoria após carregar tarefas
        loadCategories();
    } catch (error) {
        showNotification('Erro ao carregar missões: ' + error.message, 'error');
        hideLoading();
    }
}

/**
 * Renderiza as tarefas na interface
 */
function renderTasks() {
    hideLoading();

    // Limpar lista
    while (state.questList.firstChild) {
        state.questList.removeChild(state.questList.firstChild);
    }

    // Filtrar tarefas
    let filteredTasks = [...state.tasks];

    if (state.currentFilter === 'completed') {
        filteredTasks = filteredTasks.filter(task => task.completed);
    } else if (state.currentFilter === 'pending') {
        filteredTasks = filteredTasks.filter(task => !task.completed);
    } else if (state.currentFilter.startsWith('category-')) {
        // Filtrar por categoria
        const categoryId = state.currentFilter.replace('category-', '');
        filteredTasks = filteredTasks.filter(task => String(task.categoryId) === String(categoryId));
    }

    // Renderizar tarefas
    if (filteredTasks.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-message';
        emptyMessage.textContent = 'Nenhuma missão encontrada';
        emptyMessage.style.gridColumn = '1 / -1';
        emptyMessage.style.textAlign = 'center';
        emptyMessage.style.padding = '40px';
        emptyMessage.style.color = 'var(--text-muted)';
        state.questList.appendChild(emptyMessage);
        return;
    }

    filteredTasks.forEach(task => {
        const taskElement = createTaskElement(task);
        state.questList.appendChild(taskElement);
    });
}

/**
 * Cria um elemento de tarefa
 * @param {Object} task - Dados da tarefa
 * @returns {HTMLElement} Elemento da tarefa
 */
function createTaskElement(task) {
    // Clonar template
    const taskElement = document.importNode(state.questTemplate.content, true).firstElementChild;

    // Preencher dados
    taskElement.dataset.id = task.id;

    if (task.completed) {
        taskElement.classList.add('completed');
    }

    const title = taskElement.querySelector('.quest-title');
    const description = taskElement.querySelector('.quest-description');
    const dateText = taskElement.querySelector('.date-text');
    const checkbox = taskElement.querySelector('.complete-quest');
    const statusText = taskElement.querySelector('.status-text');
    const priorityText = taskElement.querySelector('.priority-text');
    const categoryText = taskElement.querySelector('.category-text');
    const dueDateText = taskElement.querySelector('.due-date-text');
    const tagsContainer = taskElement.querySelector('.quest-tags');

    title.textContent = task.title;
    description.textContent = task.description || 'Sem descrição';

    // Formatar data
    const createdDate = new Date(task.createdAt);
    dateText.textContent = createdDate.toLocaleDateString('pt-BR');

    // Status
    checkbox.checked = task.completed;
    statusText.textContent = task.completed ? 'Concluída' : 'Pendente';

    // Prioridade
    if (task.priority) {
        priorityText.textContent = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);

        // Adicionar classe de cor baseada na prioridade
        if (task.priority === 'alta') {
            priorityText.classList.add('priority-high');
        } else if (task.priority === 'média') {
            priorityText.classList.add('priority-medium');
        } else {
            priorityText.classList.add('priority-low');
        }
    } else {
        priorityText.textContent = 'Média';
    }

    // Categoria
    if (task.categoryId) {
        const category = getCategoryById(task.categoryId);
        if (category) {
            categoryText.textContent = category.name;
            categoryText.style.color = category.color;

            // Adicionar atributo de dados para facilitar a filtragem
            taskElement.dataset.categoryId = task.categoryId;
        } else {
            categoryText.textContent = 'Sem categoria';
        }
    } else {
        categoryText.textContent = 'Sem categoria';
    }

    // Data de vencimento
    if (task.dueDate) {
        const dueDate = new Date(task.dueDate);
        dueDateText.textContent = dueDate.toLocaleDateString('pt-BR');

        // Verificar se está vencida
        if (!task.completed && dueDate < new Date()) {
            dueDateText.classList.add('overdue');
        }
    } else {
        dueDateText.textContent = 'Sem prazo';
    }

    // Tags
    if (task.tags && Array.isArray(task.tags) && task.tags.length > 0) {
        tagsContainer.innerHTML = '';
        task.tags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'tag';
            tagElement.textContent = tag;
            tagsContainer.appendChild(tagElement);
        });
    }

    // Eventos
    const editBtn = taskElement.querySelector('.edit-quest');
    const deleteBtn = taskElement.querySelector('.delete-quest');

    editBtn.addEventListener('click', () => {
        openModal(task);
    });

    deleteBtn.addEventListener('click', () => {
        confirmDeleteTask(task);
    });

    checkbox.addEventListener('change', () => {
        toggleTaskStatus(task.id, checkbox.checked);
    });

    return taskElement;
}

/**
 * Obtém uma categoria pelo ID
 * @param {string|number} id - ID da categoria
 * @returns {Object|null} Categoria encontrada ou null
 */
function getCategoryById(id) {
    if (!id) return null;

    // Converter para string para garantir comparação correta
    const categoryId = String(id);
    return state.categories.find(cat => String(cat.id) === categoryId) || null;
}

/**
 * Adiciona uma nova tarefa à lista
 * @param {Object} task - Dados da tarefa
 */
function addTask(task) {
    state.tasks.push(task);
    renderTasks();
    updateStats();
    addXP(10);
}

/**
 * Confirma a exclusão de uma tarefa
 * @param {Object} task - Tarefa a ser excluída
 */
function confirmDeleteTask(task) {
    if (confirm(`Tem certeza que deseja excluir a missão "${task.title}"?`)) {
        deleteTaskFromUI(task.id);
    }
}

/**
 * Remove uma tarefa
 * @param {number} id - ID da tarefa
 */
async function deleteTaskFromUI(id) {
    try {
        // Usar a função importada do módulo api
        await window.deleteTask(id);

        const index = state.tasks.findIndex(task => task.id === id);

        if (index !== -1) {
            state.tasks.splice(index, 1);
            renderTasks();
            updateStats();
            showNotification('Missão removida com sucesso!', 'success');

            // Atualizar contadores de categoria
            loadCategories();
        }
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

/**
 * Alterna o status de uma tarefa
 * @param {number} id - ID da tarefa
 * @param {boolean} completed - Novo status
 */
async function toggleTaskStatus(id, completed) {
    try {
        const task = state.tasks.find(task => task.id === id);

        if (!task) return;

        const wasCompleted = task.completed;

        // Enviar todos os dados necessários da tarefa, não apenas o status
        const updatedTask = await window.updateTask(id, {
            title: task.title,
            description: task.description,
            priority: task.priority,
            categoryId: task.categoryId,
            dueDate: task.dueDate,
            tags: task.tags,
            completed: completed
        });

        updateTaskInUI(updatedTask);

        if (!wasCompleted && completed) {
            showNotification('Missão concluída! +20 XP', 'success');
            addXP(20);

            // Verificar conquista: Produtividade Máxima
            const completedCount = state.tasks.filter(t => t.completed).length;
            if (completedCount >= 3) {
                unlockAchievement('productive', 'Produtividade Máxima');
            }
        }

        // Atualizar contadores de categoria
        loadCategories();
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

/**
 * Atualiza as estatísticas do jogador
 */
function updateStats() {
    const completed = state.tasks.filter(task => task.completed).length;
    const pending = state.tasks.length - completed;

    state.completedCount.textContent = completed;
    state.pendingCount.textContent = pending;
    state.playerStats.completedTasks = completed;
}

/**
 * Adiciona XP ao jogador
 * @param {number} amount - Quantidade de XP
 */
function addXP(amount) {
    state.playerStats.xp += amount;

    // Verificar level up
    if (state.playerStats.xp >= state.playerStats.xpToNextLevel) {
        levelUp();
    } else {
        updateXPBar();
        updateXPRemaining();
    }
}

/**
 * Aumenta o nível do jogador
 */
function levelUp() {
    state.playerStats.level++;
    state.playerStats.xp -= state.playerStats.xpToNextLevel;
    state.playerStats.xpToNextLevel = Math.floor(state.playerStats.xpToNextLevel * 1.5);

    document.querySelector('.level-text').textContent = `Nível ${state.playerStats.level}`;
    showNotification(`Parabéns! Você subiu para o nível ${state.playerStats.level}!`, 'info');

    updateXPBar();
    updateXPRemaining();
}

/**
 * Atualiza a barra de XP
 */
function updateXPBar() {
    const xpProgressElements = document.querySelectorAll('.xp-progress');
    const xpText = document.querySelector('.xp-text');

    const percentage = (state.playerStats.xp / state.playerStats.xpToNextLevel) * 100;

    xpProgressElements.forEach(element => {
        element.style.width = `${percentage}%`;
    });

    xpText.textContent = `${state.playerStats.xp}/${state.playerStats.xpToNextLevel} XP`;
}

/**
 * Atualiza a informação de XP restante para o próximo nível
 */
function updateXPRemaining() {
    const xpNeeded = state.playerStats.xpToNextLevel - state.playerStats.xp;
    state.xpRemaining.textContent = `Faltam ${xpNeeded} XP para o nível ${state.playerStats.level + 1}`;
}

/**
 * Desbloqueia uma conquista
 * @param {string} id - ID da conquista
 * @param {string} name - Nome da conquista
 */
function unlockAchievement(id, name) {
    const achievement = state.achievements[id];

    if (achievement && achievement.classList.contains('locked')) {
        achievement.classList.remove('locked');
        achievement.classList.add('unlocked');
        achievement.querySelector('i').className = 'fas fa-trophy';

        state.playerStats.achievements++;
        state.achievementsCount.textContent = state.playerStats.achievements;

        showNotification(`Conquista desbloqueada: ${name}! +50 XP`, 'info');
        addXP(50);
    }
}

/**
 * Mostra uma notificação
 * @param {string} message - Mensagem da notificação
 * @param {string} type - Tipo da notificação (success, error, info)
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    let icon;
    switch (type) {
        case 'success':
            icon = 'fa-check-circle';
            break;
        case 'error':
            icon = 'fa-exclamation-circle';
            break;
        default:
            icon = 'fa-info-circle';
    }

    notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;

    state.notificationContainer.appendChild(notification);

    // Mostrar notificação com animação
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Remover notificação após 5 segundos
    setTimeout(() => {
        notification.classList.remove('show');

        // Remover do DOM após a animação
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 5000);
}

/**
 * Mostra o indicador de carregamento
 */
function showLoading() {
    const loadingContainer = document.createElement('div');
    loadingContainer.className = 'loading-container';
    loadingContainer.innerHTML = `
        <div class="loading-spinner"></div>
        <p>Carregando missões...</p>
    `;

    state.questList.innerHTML = '';
    state.questList.appendChild(loadingContainer);
}

/**
 * Esconde o indicador de carregamento
 */
function hideLoading() {
    const loadingContainer = state.questList.querySelector('.loading-container');
    if (loadingContainer) {
        loadingContainer.remove();
    }
}

/**
 * Abre o modal para adicionar/editar categoria
 * @param {Object} category - Categoria a ser editada (opcional)
 */
function openCategoryModal(category = null) {
    const categoryModal = document.getElementById('category-modal');
    const nameInput = document.getElementById('category-name');
    const colorInput = document.getElementById('category-color');
    const idInput = document.getElementById('category-id');
    const modalTitle = document.getElementById('category-modal-title');

    // Limpar formulário
    document.getElementById('category-form').reset();

    if (category) {
        // Modo de edição
        modalTitle.textContent = 'Editar Categoria';
        nameInput.value = category.name;
        colorInput.value = category.color;
        idInput.value = category.id;
    } else {
        // Modo de criação
        modalTitle.textContent = 'Nova Categoria';
        idInput.value = '';
        // Definir uma cor aleatória
        const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
        colorInput.value = randomColor;
    }

    // Mostrar modal
    categoryModal.classList.add('active');
    state.overlay.classList.add('active');

    // Focar no nome
    setTimeout(() => {
        nameInput.focus();
    }, 100);
}

/**
 * Fecha o modal de categoria
 */
function closeCategoryModal() {
    const categoryModal = document.getElementById('category-modal');
    categoryModal.classList.remove('active');
    state.overlay.classList.remove('active');
}

/**
 * Manipula o envio do formulário de categoria
 */
async function handleCategoryFormSubmit() {
    const nameInput = document.getElementById('category-name');
    const colorInput = document.getElementById('category-color');
    const idInput = document.getElementById('category-id');

    const name = nameInput.value.trim();
    const color = colorInput.value;
    const id = idInput.value;

    if (!name) {
        showNotification('O nome da categoria é obrigatório', 'error');
        return;
    }

    try {
        if (id) {
            // Atualizar categoria existente
            const updatedCategory = await window.updateCategory(id, { name, color });
            updateCategoryInUI(updatedCategory);
            showNotification('Categoria atualizada com sucesso!', 'success');
        } else {
            // Criar nova categoria
            const newCategory = await window.createCategory({ name, color });
            addCategoryToUI(newCategory);
            showNotification('Nova categoria adicionada!', 'success');
        }

        closeCategoryModal();
        // Atualizar seletores de categoria nos formulários
        loadCategories();
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

/**
 * Carrega as categorias da API
 */
async function loadCategories() {
    try {
        const categories = await window.getAllCategories();
        state.categories = categories;
        window.categories = categories; // Para compatibilidade
        console.log('Categorias carregadas:', categories);

        // Verificar tarefas por categoria
        categories.forEach(category => {
            const categoryId = String(category.id);
            const tasksInCategory = state.tasks.filter(task => String(task.categoryId) === categoryId);
            console.log(`Categoria ${category.name} (ID: ${categoryId}): ${tasksInCategory.length} tarefas`);
        });

        renderCategories(categories);
        updateCategorySelects(categories);
    } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        showNotification('Erro ao carregar categorias: ' + error.message, 'error');
    }
}

/**
 * Renderiza as categorias na interface
 * @param {Array} categories - Lista de categorias
 */
function renderCategories(categories) {
    const categoriesList = document.getElementById('categories-list');
    if (!categoriesList) return;

    // Limpar lista
    categoriesList.innerHTML = '';

    if (categories.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-category-message';
        emptyMessage.textContent = 'Nenhuma categoria encontrada';
        emptyMessage.style.padding = '10px';
        emptyMessage.style.color = 'var(--text-muted)';
        emptyMessage.style.fontSize = '14px';
        categoriesList.appendChild(emptyMessage);
        return;
    }

    // Adicionar categoria "Todas" para filtro
    const allCategory = document.createElement('div');
    allCategory.className = 'category-item';
    if (state.currentFilter === 'all') {
        allCategory.classList.add('active');
    }
    allCategory.innerHTML = `
        <div class="category-color" style="background-color: var(--primary-color)"></div>
        <span class="category-name">Todas</span>
        <span class="category-count">${state.tasks.length}</span>
    `;
    allCategory.addEventListener('click', () => {
        state.currentFilter = 'all';
        renderTasks();
        updateActiveCategory();
    });
    categoriesList.appendChild(allCategory);

    // Renderizar categorias
    categories.forEach(category => {
        const categoryElement = createCategoryElement(category);
        categoriesList.appendChild(categoryElement);
    });

    // Atualizar a categoria ativa
    updateActiveCategory();
}

/**
 * Atualiza a categoria ativa na interface
 */
function updateActiveCategory() {
    const categoriesList = document.getElementById('categories-list');
    if (!categoriesList) return;

    // Remover classe ativa de todas as categorias
    const categoryItems = categoriesList.querySelectorAll('.category-item');
    categoryItems.forEach(item => {
        item.classList.remove('active');
    });

    // Adicionar classe ativa à categoria selecionada
    if (state.currentFilter === 'all') {
        const allCategory = categoriesList.querySelector('.category-item:first-child');
        if (allCategory) {
            allCategory.classList.add('active');
        }
    } else if (state.currentFilter.startsWith('category-')) {
        const categoryId = state.currentFilter.replace('category-', '');
        const selectedCategory = categoriesList.querySelector(`.category-item[data-id="${categoryId}"]`);
        if (selectedCategory) {
            selectedCategory.classList.add('active');
        }
    }
}

/**
 * Cria um elemento de categoria
 * @param {Object} category - Dados da categoria
 * @returns {HTMLElement} Elemento da categoria
 */
function createCategoryElement(category) {
    const categoryElement = document.createElement('div');
    categoryElement.className = 'category-item';
    categoryElement.dataset.id = category.id;

    // Verificar se esta categoria está ativa
    if (state.currentFilter === `category-${category.id}`) {
        categoryElement.classList.add('active');
    }

    // Contar tarefas nesta categoria
    const categoryId = String(category.id);
    const taskCount = state.tasks.filter(task => String(task.categoryId) === categoryId).length;

    categoryElement.innerHTML = `
        <div class="category-color" style="background-color: ${category.color}"></div>
        <span class="category-name">${category.name}</span>
        <span class="category-count">${taskCount}</span>
    `;

    // Evento de clique para filtrar tarefas
    categoryElement.addEventListener('click', () => {
        state.currentFilter = `category-${category.id}`;
        renderTasks();
        updateActiveCategory();
    });

    return categoryElement;
}

/**
 * Atualiza os seletores de categoria nos formulários
 * @param {Array} categories - Lista de categorias
 */
function updateCategorySelects(categories) {
    const selects = document.querySelectorAll('select[id$="category"]');

    selects.forEach(select => {
        // Preservar a opção selecionada atual
        const currentValue = select.value;

        // Limpar opções, mantendo apenas a opção padrão
        while (select.options.length > 1) {
            select.remove(1);
        }

        // Adicionar categorias como opções
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            option.style.color = category.color;
            select.appendChild(option);
        });

        // Restaurar valor selecionado, se possível
        if (currentValue) {
            select.value = currentValue;
        }
    });
}

/**
 * Adiciona uma nova categoria à interface
 * @param {Object} category - Dados da categoria
 */
function addCategoryToUI(category) {
    const categoriesList = document.getElementById('categories-list');
    if (!categoriesList) return;

    // Remover mensagem de vazio, se existir
    const emptyMessage = categoriesList.querySelector('.empty-category-message');
    if (emptyMessage) {
        emptyMessage.remove();
    }

    const categoryElement = createCategoryElement(category);
    categoriesList.appendChild(categoryElement);
}

/**
 * Atualiza uma categoria existente na interface
 * @param {Object} updatedCategory - Dados atualizados da categoria
 */
function updateCategoryInUI(updatedCategory) {
    const categoryElement = document.querySelector(`.category-item[data-id="${updatedCategory.id}"]`);
    if (!categoryElement) return;

    const colorElement = categoryElement.querySelector('.category-color');
    const nameElement = categoryElement.querySelector('.category-name');

    colorElement.style.backgroundColor = updatedCategory.color;
    nameElement.textContent = updatedCategory.name;
}

// Exportar funções para uso global
window.ui = {
    init,
    loadTasks,
    loadCategories,
    openModal,
    closeModal,
    openCategoryModal,
    closeCategoryModal,
    showNotification,
    addXP,
    unlockAchievement
}; 