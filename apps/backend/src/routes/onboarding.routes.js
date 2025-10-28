import { Router } from 'express';
import { createCompany } from '../controllers/company.controller.js';

const router = Router();

router.post('/companies', createCompany);

export default router;