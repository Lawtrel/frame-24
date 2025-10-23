import { Router } from 'express';
import {
  getAllEmployees,
  createEmployee,
} from '../controllers/customer.controller.js';

const router = Router();

router.get('/customers', getAllEmployees);
router.post('/customers', createEmployee);

export default router;