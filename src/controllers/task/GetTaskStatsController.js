const getTaskStatsService = require('../../services/task/GetTaskStatsService');
const catchAsync = require('../../utils/catchAsync');

/**
 * Controlador responsável por obter estatísticas das tarefas
 */
class GetTaskStatsController {
    /**
     * Manipula a requisição para obter estatísticas das tarefas
     */
    handle = catchAsync(async (req, res) => {
        const stats = await getTaskStatsService.execute();

        res.status(200).json({
            status: 'success',
            data: { stats }
        });
    });
}

module.exports = new GetTaskStatsController(); 