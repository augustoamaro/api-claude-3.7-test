/**
 * Configurações da aplicação
 */
const config = {
    // Ambiente
    env: process.env.NODE_ENV || 'development',

    // Servidor
    port: process.env.PORT || 3000,

    // Configurações de CORS
    cors: {
        origin: process.env.CORS_ORIGIN || '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
    },

    // Configurações de logging
    logging: {
        level: process.env.LOG_LEVEL || 'info'
    }
};

// Validar configurações críticas
const validateConfig = () => {
    // Adicionar validações conforme necessário
    return true;
};

// Executar validação
validateConfig();

module.exports = config; 