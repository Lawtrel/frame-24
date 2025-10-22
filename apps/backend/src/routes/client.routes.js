import { Router } from 'express';
import {
  createClient,
  getAllClients,
} from '../controllers/client.controller.js';

const router = Router();

router.post('/clients', createClient);
router.get('/clients', getAllClients);

export default router;