require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const config = require('./config/config');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');
const taskRoutes = require('./routes/taskRoutes');

/**
 * Aplicação Express
 * @type {Object}
 */
const app = express();

// Middlewares
app.use(helmet({
    contentSecurityPolicy: false // Desabilitar para desenvolvimento
}));
app.use(cors(config.cors));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// Rota de status
app.get('/api/status', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'API está funcionando corretamente',
        timestamp: new Date(),
        environment: config.env
    });
});

// Rotas da API
app.use('/api/tasks', taskRoutes);

// Rota para o frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Middleware de erro
app.use(notFound);
app.use(errorHandler);

// Iniciar servidor
const PORT = config.port;
const server = app.listen(PORT, () => {
    console.log(`🚀 Server running in ${config.env} mode on port ${PORT}`);
    console.log(`📱 Frontend disponível em: http://localhost:${PORT}`);
    console.log(`🔌 API disponível em: http://localhost:${PORT}/api`);
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

// Tratamento de SIGTERM
process.on('SIGTERM', () => {
    console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
    server.close(() => {
        console.log('💥 Process terminated!');
    });
});

module.exports = app; // Para testes