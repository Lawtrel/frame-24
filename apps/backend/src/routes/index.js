import { Router } from 'express';
import movieRoutes from './movie.routes.js';
import clientRoutes from './client.routes.js';
import employeeRoutes from './employee.routes.js';

const router = Router();

router.use('/api', movieRoutes);
router.use('/api', clientRoutes);
router.use('/api', employeeRoutes);
// router.use('/api', roomRoutes);
// router.use('/api', sessionRoutes);
// router.use('/api', bookingRoutes);

export default router;