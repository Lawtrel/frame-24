import { Router } from 'express';
import {
  getAllCustomers,
  createCustomer,
} from '../controllers/customer.controller.js';

const router = Router();

router.get('/customers', getAllCustomers);
router.post('/customers', createCustomer);

export default router;