import prisma from '../lib/prisma.js';
import logger from '../utils/logger.js';

export const SupplierService = {

    create: async (data, companyId) => {
        const companyIdBigInt = BigInt(companyId);

        const supplierData = {
            ...data,
            company_id: companyIdBigInt,
            active: true
        };

        try {
            const supplier = await prisma.suppliers.create({
                data: supplierData,
            });

            logger.info('Fornecedor criado com sucesso.', { supplierId: supplier.id.toString(), companyId });
            return supplier;
        } catch (error) {
            logger.error('Erro ao criar fornecedor.', { message: error.message, companyId });
            throw new Error('Não foi possível criar o fornecedor. Verifique os dados fornecidos.');
        }
    },


    getAll: async (companyId, query) => {
        const companyIdBigInt = BigInt(companyId);
        const { search, active } = query;

        const where = {
            company_id: companyIdBigInt,
        };

        if (active !== undefined) {
            where.active = active === 'true';
        }

        if (search) {
            where.OR = [
                { company_name: { contains: search, mode: 'insensitive' } },
                { contact_name: { contains: search, mode: 'insensitive' } },
            ];
        }

        const suppliers = await prisma.suppliers.findMany({
            where,
            orderBy: { company_name: 'asc' }
        });

        return suppliers;
    },


    getById: async (supplierId, companyId) => {
        const supplierIdBigInt = BigInt(supplierId);
        const companyIdBigInt = BigInt(companyId);

        const supplier = await prisma.suppliers.findFirst({
            where: {
                id: supplierIdBigInt,
                company_id: companyIdBigInt,
            },
        });

        if (!supplier) {
            throw new Error('Fornecedor não encontrado ou não disponível para sua empresa.');
        }

        return supplier;
    },


    update: async (supplierId, companyId, data) => {
        const supplierIdBigInt = BigInt(supplierId);
        const companyIdBigInt = BigInt(companyId);

        await SupplierService.getById(supplierId, companyId);

        delete data.company_id;

        try {
            const updatedSupplier = await prisma.suppliers.update({
                where: { id: supplierIdBigInt },
                data: {
                    ...data,
                    company_id: companyIdBigInt
                }
            });

            logger.info('Fornecedor atualizado com sucesso.', { supplierId, companyId });
            return updatedSupplier;
        } catch (error) {
            logger.error('Erro ao atualizar fornecedor.', { message: error.message, supplierId, companyId });
            throw new Error('Não foi possível atualizar o fornecedor.');
        }
    },


    delete: async (supplierId, companyId) => {
        const supplierIdBigInt = BigInt(supplierId);

        await SupplierService.getById(supplierId, companyId);

        try {
            await prisma.suppliers.update({
                where: { id: supplierIdBigInt },
                data: { active: false },
            });

            logger.info('Fornecedor desativado (soft delete).', { supplierId, companyId });
        } catch (error) {
            logger.error('Erro ao desativar fornecedor.', { message: error.message, supplierId, companyId });
            throw new Error('Não foi possível desativar o fornecedor.');
        }
    }
};