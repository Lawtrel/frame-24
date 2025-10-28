import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';
import logger from '../utils/logger.js';

const JWT_SECRET = process.env.JWT_SECRET || 'frame24-secret';



const getPermissionsFromDatabase = async (companyId, roleCode) => {

    if (typeof companyId !== 'bigint') {
        logger.error('companyId não é BigInt ao buscar permissões.', { companyId, roleCode });
        return [];
    }

    try {
        const profile = await prisma.access_profiles.findUnique({
            where: {
                company_id_code: {
                    company_id: companyId,
                    code: roleCode,
                }
            },
            include: {
                profile_permissions: {
                    include: {
                        system_routines: true,
                    }
                }
            }
        });

        if (!profile) {
            logger.warn(`Perfil de acesso não encontrado para o role: ${roleCode}`, { companyId: companyId.toString() });
            return [];
        }

        const permissions = profile.profile_permissions
            .map(pp => {
                const routine = pp.system_routines;
                const resource = routine?.resource_name || routine?.routine_name;
                const action = pp.operation.toLowerCase();

                if (resource && action) {
                    return `${resource}:${action}`;
                }
                return null;
            })
            .filter(p => p !== null);

        return permissions;

    } catch (error) {
        logger.error('Erro na busca de permissões no DB.', { message: error.message, companyId: companyId.toString() });
        return [];
    }
};

export const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    let decoded;

    try {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            logger.warn('Token não fornecido no cabeçalho de autenticação.');
            return res.status(401).json({ error: 'Token não fornecido' });
        }

        const token = authHeader.substring(7);

        decoded = jwt.verify(token, JWT_SECRET);

        const identityId = decoded.sub;

        const identity = await prisma.identities.findUnique({
            where: { id: identityId },
            include: {
                employees: {
                    include: {
                        companies: true,
                    }
                },
                company_users: true
            }
        });

        const employee = identity?.employees;
        const company = employee?.companies;

        if (!identity || !identity.active || !employee || !employee.active || !company) {
            logger.warn('Token fornecido é de um usuário/identidade inativa ou sem empresa associada.', { sub: identityId });
            return res.status(401).json({ error: 'Token inválido' });
        }

        const roleSlug = identity.company_users?.[0]?.role || 'employee';
        const userCompanyId = company.id;

        const userPermissions = await getPermissionsFromDatabase(userCompanyId, roleSlug);

        req.user = {
            sub: identityId.toString(),
            employee_id: employee.id.toString(),
            email: identity.email,
            name: employee.full_name,
            tenant_id: company.tenant_slug,
            company_id: userCompanyId.toString(),
            role: roleSlug,
            permissions: userPermissions
        };

        req.companyId = req.user.company_id;

        logger.debug('Autenticação JWT bem-sucedida. Contexto de Tenant definido.', { sub: req.user.sub, companyId: req.companyId });

        next();

    } catch (error) {
        const logContext = {
            tokenDetails: decoded,
            message: error.message,
            stack: error.stack
        };

        if (error.name === 'TokenExpiredError') {
            logger.warn('Erro de autenticação: Token expirado.', logContext);
            return res.status(401).json({ error: 'Token expirado' });
        }

        logger.error('Erro de autenticação (JWT inválido ou falha na busca):', logContext);
        res.status(401).json({ error: 'Token inválido' });
    }
};

export default { authenticate };