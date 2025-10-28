import { Router } from 'express';
import movieRoutes from './movie.routes.js';
import customerRoutes from './customer.routes.js';
import clientRoutes from './client.routes.js';
import onboardingRoutes from "./onboarding.routes.js";
import authRoutes from "./auth.routes.js";
import adminRoutes from "./admin.routes.js";
import supplierRoutes from "./supplier.routes.js";

const router = Router();

router.use('/api', movieRoutes);
router.use('/api', adminRoutes)
router.use('/api', customerRoutes);
router.use('/api', clientRoutes);
router.use('/api', onboardingRoutes);
router.use('/api', authRoutes);
router.use('/api', supplierRoutes);

// router.use('/api', roomRoutes);
// router.use('/api', sessionRoutes);
// router.use('/api', bookingRoutes);

export default router;