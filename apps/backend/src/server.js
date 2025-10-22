import express from 'express';
import cors from 'cors';
import allRoutes from './routes/index.js';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: `API do Frame 24 está no ar!`, time: new Date() });
});

app.use(allRoutes);

app.listen(port, () => {
  console.log(`🚀 API Frame 24 rodando em http://localhost:${port}`);
});