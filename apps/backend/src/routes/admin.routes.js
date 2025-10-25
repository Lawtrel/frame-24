import { Router } from 'express';
import { permissionRegistry } from '../utils/PermissionRegistry.js';

const router = Router();

router.get('/admin/permissions/catalog', (req, res) => {


    const allPermissions = permissionRegistry.getAll();

    res.json(allPermissions);
});

export default router;