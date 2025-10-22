import { Router } from 'express';
import {
  createEmployee,
  getAllEmployees,
} from '../controllers/customer.controller.js';

const router = Router();

router.post('/employees', createEmployee);
router.get('/employees', getAllEmployees);

export default router;