import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import allRoutes from './routes/index.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({
        status: 'API do Frame 24 está no ar!',
        time: new Date()
    });
});

app.use(allRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo deu errado no servidor.' });
});

app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada.' });
});

app.listen(port, () => {
    console.log(`🚀 API Frame 24 rodando em http://localhost:${port}`);
    console.log(`📊 Health check disponível em http://localhost:${port}/api/health`);
});