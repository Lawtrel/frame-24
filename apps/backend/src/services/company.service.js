import prisma from '../lib/prisma.js';
import { hashPassword } from './auth-util.service.js';
import { generateEmployeeNumber, generateTenantSlug } from '../utils/company.util.js';
import logger from '../utils/logger.js';
import { initializeTenantData } from './tenant-init.service.js';

export const createCompanyAndAdminStructure = async (data) => {
    const {
        corporate_name,
        trade_name,
        cnpj,
        admin_name,
        admin_email,
        admin_password,
        admin_cpf
    } = data;

    const tenant_slug = generateTenantSlug(corporate_name, cnpj);

    return prisma.$transaction(async (tx) => {
        const password_hash = await hashPassword(admin_password);
        const username = admin_email.split('@')[0];

        const company = await tx.companies.create({
            data: {
                corporate_name,
                trade_name: trade_name || corporate_name,
                cnpj,
                tenant_slug,
                plan_type: 'BASIC',
                active: true
            }
        });

        logger.info(`✅ Empresa criada: ${company.corporate_name} (ID: ${company.id})`);

        await initializeTenantData(tx, company.id);

        const contract_type_record = await tx.employment_contract_types.findFirst({
            where: { company_id: company.id, name: 'CLT' }
        });

        const super_admin_profile = await tx.access_profiles.findFirst({
            where: { company_id: company.id, code: 'SUPER_ADMIN' }
        });

        if (!contract_type_record || !super_admin_profile) {
            throw new Error("Dados de inicialização críticos (CLT ou SUPER_ADMIN) não foram encontrados.");
        }

        const cinema_complex = await tx.cinema_complexes.create({
            data: {
                company_id: company.id,
                name: `${corporate_name} - Matriz`,
                code: `MATRIZ-${company.id}`,
                ibge_municipality_code: data.ibge_municipality_code || '3550308',
                active: true
            }
        });

        logger.info(`✅ Complexo criado: ${cinema_complex.name} (ID: ${cinema_complex.id})`);

        const department = await tx.departments.create({
            data: {
                company_id: company.id,
                complex_id: cinema_complex.id,
                name: 'Administração',
                description: 'Departamento administrativo',
                cost_center: 'ADM001',
                active: true
            }
        });

        const position = await tx.positions.create({
            data: {
                name: 'Administrador',
                description: 'Administrador do sistema',
                active: true,
                companies: { connect: { id: company.id } },
                departments: { connect: { id: department.id } }
            }
        });

        const identity = await tx.identities.create({
            data: {
                email: admin_email,
                password_hash: password_hash,
                identity_type: 'EMPLOYEE',
                email_verified: true,
                active: true
            }
        });

        logger.info(`✅ Identity criada: ${identity.email} (ID: ${identity.id})`);

        const employee_number = generateEmployeeNumber(company.id);

        const employee = await tx.employees.create({
            data: {
                employee_number,
                work_email: admin_email,
                full_name: admin_name,
                cpf: admin_cpf.replace(/\D/g, ''),
                hire_date: new Date(),
                current_salary: 0.00,
                active: true,

                identities: { connect: { id: identity.id } },

                companies: { connect: { id: company.id } },
                cinema_complexes: { connect: { id: cinema_complex.id } },
                positions: { connect: { id: position.id } },
                employment_contract_types: { connect: { id: contract_type_record.id } }
            }
        });

        logger.info(`✅ Employee criado: ${employee.full_name} (Nº: ${employee.employee_number})`);

        const system_user = await tx.system_users.create({
            data: {
                username,
                email: admin_email,
                password_hash,
                active: true,
                employees: { connect: { id: employee.id } }
            }
        });

        logger.info(`✅ System User criado: ${system_user.username} (ID: ${system_user.id})`);

        // 9. ATUALIZAR DEPARTAMENTO COM MANAGER
        await tx.departments.update({
            where: { id: department.id },
            data: { manager_id: employee.id }
        });

        await tx.company_users.create({
            data: {
                company_id: company.id,
                identity_id: identity.id,
                employee_id: employee.id,
                role: 'SUPER_ADMIN',
                active: true
            }
        });

        await tx.user_profiles.create({
            data: {
                active: true,
                companies: { connect: { id: company.id } },
                access_profiles: { connect: { id: super_admin_profile.id } },
                system_users_user_profiles_user_idTosystem_users: {
                    connect: { id: system_user.id }
                },
                system_users_user_profiles_assigned_byTosystem_users: {
                    connect: { id: system_user.id }
                }
            }
        });

        logger.info(`✅ Estrutura completa criada com sucesso!`);

        return {
            company,
            employee,
            identity,
            tenant_slug
        };
    });
};