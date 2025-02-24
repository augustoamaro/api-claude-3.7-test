/**
 * app.js - Ponto de entrada da aplicação
 * 
 * Este arquivo inicializa a aplicação e coordena a interação
 * entre a interface do usuário e a API.
 * Implementado em estilo funcional.
 */

// Inicializar a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar a interface do usuário
    ui.init();

    // Carregar tarefas da API
    loadTasks();

    // Verificar status da API
    checkAPIStatus();

    // Configurar easter egg
    setupKonamiCode();
});

/**
 * Carrega as tarefas da API
 */
async function loadTasks() {
    try {
        await ui.loadTasks();
    } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
        ui.showNotification('Não foi possível carregar as missões. Verifique se a API está rodando.', 'error');
    }
}

/**
 * Verifica o status da API
 */
async function checkAPIStatus() {
    try {
        const response = await fetch('http://localhost:3000/api/status');

        if (!response.ok) {
            throw new Error(`Erro ao verificar status da API: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Status:', data);

        // Mostrar notificação de boas-vindas
        setTimeout(() => {
            ui.showNotification('Bem-vindo ao Quest Manager! Complete missões para ganhar XP e subir de nível.', 'info');
        }, 1000);
    } catch (error) {
        console.error('Erro ao verificar status da API:', error);
        ui.showNotification('Não foi possível conectar à API. Verifique se o servidor está rodando.', 'error');
    }
}

/**
 * Configura o código Konami (easter egg)
 */
function setupKonamiCode() {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        // Verificar se a tecla pressionada corresponde à próxima tecla do código Konami
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;

            // Se o código completo for inserido
            if (konamiIndex === konamiCode.length) {
                activateEasterEgg();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
}

/**
 * Ativa o easter egg quando o código Konami é inserido
 */
function activateEasterEgg() {
    // Adicionar 100 XP
    ui.addXP(100);
    ui.showNotification('🎮 Código Konami ativado! +100 XP', 'success');

    // Efeito visual
    document.body.classList.add('konami');
    setTimeout(() => {
        document.body.classList.remove('konami');
    }, 3000);
}

/**
 * Adiciona efeitos sonoros (opcional)
 */
function setupSoundEffects() {
    // Implementação futura de efeitos sonoros
    console.log('Efeitos sonoros serão implementados em uma versão futura.');
} 