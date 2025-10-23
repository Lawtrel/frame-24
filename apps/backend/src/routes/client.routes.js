import { Router } from 'express';
import {
  createCustomer,
  getAllCustomers,
} from '../controllers/client.controller.js';

const router = Router();

router.post('/clients', createCustomer);
router.get('/clients', getAllCustomers);

export default router;