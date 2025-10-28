import { SupplierService } from '../services/supplier.service.js';
import logger from '../utils/logger.js';


export const createSupplier = async (req, res) => {
    try {
        const companyId = req.companyId;
        const supplier = await SupplierService.create(req.body, companyId);

        res.status(201).json({
            success: true,
            data: supplier
        });
    } catch (error) {
        logger.error('Erro no controller ao criar fornecedor.', { message: error.message, companyId: req.companyId });
        res.status(500).json({
            error: error.message
        });
    }
};


export const getAllSuppliers = async (req, res) => {
    try {
        const companyId = req.companyId;
        const suppliers = await SupplierService.getAll(companyId, req.query);

        res.json({
            success: true,
            data: suppliers,
            count: suppliers.length
        });
    } catch (error) {
        logger.error('Erro no controller ao buscar fornecedores.', { message: error.message, companyId: req.companyId });
        res.status(500).json({
            error: 'Não foi possível buscar os fornecedores.'
        });
    }
};


export const getSupplierById = async (req, res) => {
    try {
        const supplierId = req.params.id;
        const companyId = req.companyId;

        const supplier = await SupplierService.getById(supplierId, companyId);

        res.json({
            success: true,
            data: supplier
        });
    } catch (error) {
        logger.error('Erro no controller ao buscar fornecedor por ID.', { message: error.message, supplierId: req.params.id, companyId: req.companyId });

        if (error.message.includes('não encontrado')) {
            return res.status(404).json({ error: error.message });
        }

        res.status(500).json({
            error: 'Não foi possível buscar o fornecedor.'
        });
    }
};


export const updateSupplier = async (req, res) => {
    try {
        const supplierId = req.params.id;
        const companyId = req.companyId;

        const updatedSupplier = await SupplierService.update(supplierId, companyId, req.body);

        res.json({
            success: true,
            data: updatedSupplier
        });
    } catch (error) {
        logger.error('Erro no controller ao atualizar fornecedor.', { message: error.message, supplierId: req.params.id, companyId: req.companyId });

        if (error.message.includes('não encontrado')) {
            return res.status(404).json({ error: error.message });
        }

        res.status(500).json({
            error: 'Não foi possível atualizar o fornecedor.'
        });
    }
};


export const deleteSupplier = async (req, res) => {
    try {
        const supplierId = req.params.id;
        const companyId = req.companyId;

        await SupplierService.delete(supplierId, companyId);

        res.status(204).send();
    } catch (error) {
        logger.error('Erro no controller ao desativar fornecedor.', { message: error.message, supplierId: req.params.id, companyId: req.companyId });

        if (error.message.includes('não encontrado')) {
            return res.status(404).json({ error: error.message });
        }

        res.status(500).json({
            error: 'Não foi possível desativar o fornecedor.'
        });
    }
};