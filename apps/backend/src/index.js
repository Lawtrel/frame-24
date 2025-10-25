import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import allRoutes from './routes/index.js';
import logger from './utils/logger.js';
import {enableBigIntSerialization} from "./utils/bigint-serializer.js";

dotenv.config();
enableBigIntSerialization();
const app = express();
const port = process.env.PORT || 3002;
const env = process.env.NODE_ENV || 'development';

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({
        status: 'API do Frame 24 está no ar!',
        environment: env,
        time: new Date()
    });
});

app.use(allRoutes);

app.use((err, req, res, next) => {
    logger.error('ERRO GLOBAL NÃO TRATADO', {
        path: req.originalUrl,
        method: req.method,
        error: err.message,
        stack: err.stack,
    });

    const errorMessage = env === 'production' ? 'Erro interno no servidor.' : err.message;

    res.status(500).json({ error: errorMessage });
});

app.use((req, res) => {
    logger.warn(`Rota não encontrada: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ error: 'Rota não encontrada.' });
});

const startServer = () => {
    app.listen(port, () => {
        logger.info(`🚀 API Frame 24 iniciada com sucesso.`, {
            port: port,
            env: env,
            url: `http://localhost:${port}`
        });
        logger.info(`📊 Health check disponível em /api/health`);
    });
};

startServer();