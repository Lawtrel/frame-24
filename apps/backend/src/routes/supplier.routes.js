import { Router } from 'express';
import { authenticate } from '../middlewares/auth.js';
import { authorize } from '../middlewares/authorization.js';

import {
    createSupplier,
    getAllSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSupplier
} from '../controllers/supplier.controller.js';

const router = Router();
const RESOURCE = 'suppliers';

router.use(authenticate);



router.post(
    '/suppliers',
    authorize(RESOURCE, 'create'),
    createSupplier
);

router.get(
    '/suppliers',
    authorize(RESOURCE, 'read'),
    getAllSuppliers
);

router.get(
    '/suppliers/:id',
    authorize(RESOURCE, 'read'),
    getSupplierById
);

router.put(
    '/suppliers/:id',
    authorize(RESOURCE, 'update'),
    updateSupplier
);

router.delete(
    '/suppliers/:id',
    authorize(RESOURCE, 'delete'),
    deleteSupplier
);


export default router;