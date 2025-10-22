import { Router } from 'express';
import movieRoutes from './movie.routes.js';
import customerRoutes from './customer.routes.js';

const router = Router();

router.use('/api', movieRoutes);
router.use('/api', customerRoutes);
// router.use('/api', roomRoutes);
// router.use('/api', sessionRoutes);
// router.use('/api', bookingRoutes);

export default router;