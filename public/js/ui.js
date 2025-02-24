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
}

/**
 * Abre o modal para adicionar/editar tarefa
 * @param {Object} task - Tarefa a ser editada (opcional)
 */
function openModal(task = null) {
    const titleInput = document.getElementById('quest-title');
    const descriptionInput = document.getElementById('quest-description');
    const idInput = document.getElementById('quest-id');

    // Limpar formulário
    state.questForm.reset();

    if (task) {
        // Modo de edição
        state.modalTitle.textContent = 'Editar Missão';
        titleInput.value = task.title;
        descriptionInput.value = task.description || '';
        idInput.value = task.id;
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

    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    const id = idInput.value;

    if (!title) {
        showNotification('O título da missão é obrigatório', 'error');
        return;
    }

    try {
        if (id) {
            // Atualizar tarefa existente
            const updatedTask = await window.updateTask(id, { title, description });
            updateTaskInUI(updatedTask);
            showNotification('Missão atualizada com sucesso!', 'success');
        } else {
            // Criar nova tarefa
            const newTask = await window.createTask({ title, description });
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
        renderTasks();
        updateStats();
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

    title.textContent = task.title;
    description.textContent = task.description || 'Sem descrição';

    // Formatar data
    const createdDate = new Date(task.createdAt);
    dateText.textContent = createdDate.toLocaleDateString('pt-BR');

    // Status
    checkbox.checked = task.completed;
    statusText.textContent = task.completed ? 'Concluída' : 'Pendente';

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

// Exportar funções para uso global
window.ui = {
    init,
    loadTasks,
    openModal,
    closeModal,
    showNotification,
    addXP,
    unlockAchievement
}; 