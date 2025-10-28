import { OpaService } from '../services/opa.service.js';
import { permissionRegistry } from '../utils/PermissionRegistry.js';
import logger from "../utils/logger.js";

const getActionFromMethod = (method) => {
    const methodMap = {
        'GET': 'read',
        'POST': 'create',
        'PUT': 'update',
        'PATCH': 'update',
        'DELETE': 'delete'
    };
    return methodMap[method] || 'read';
};



const getResourceTenant = (req) => {
    if (req.headers['x-tenant-id']) {
        return req.headers['x-tenant-id'];
    }

    if (req.params.tenantSlug) {
        return req.params.tenantSlug;
    }

    if (req.query.tenant) {
        return req.query.tenant;
    }

    if (req.user && req.user.tenant_id) {
        return req.user.tenant_id;
    }

    return null;
};



export const authorize = (resourceType, action = null) => {

    const actionForRegistry = action || getActionFromMethod('GET');
    const permissionString = `${resourceType}:${actionForRegistry}`;
    permissionRegistry.add(permissionString);


    return async (req, res, next) => {
        const resourceTenantId = getResourceTenant(req);
        const actionOnRequest = action || getActionFromMethod(req.method);
        const logContext = {
            userId: req.user?.sub,
            resourceType: resourceType,
            requestMethod: req.method,
            userTenant: req.user?.tenant_id,
            resourceTenant: resourceTenantId,
        };

        try {
            if (!req.user) {
                logger.warn('Acesso negado: Token JWT ausente no req.user. Requer autenticação prévia.', logContext);
                return res.status(401).json({
                    error: 'Não autenticado',
                    details: 'Token JWT não encontrado ou inválido'
                });
            }

            const input = {
                user: {
                    id: req.user.sub,
                    employee_id: req.user.employee_id,
                    tenant_id: req.user.tenant_id,
                    permissions: req.user.permissions,
                    role: req.user.role,
                    email: req.user.email,
                    name: req.user.name
                },
                resource: {
                    type: resourceType,
                    tenant_id: resourceTenantId,
                    path: req.path,
                    method: req.method
                },
                action: actionOnRequest
            };

            logger.info('🔐 Autorização solicitada.', {
                user: input.user.id,
                resource: input.resource.type,
                action: input.action,
                tenant: input.user.tenant_id,
                resourceTenant: input.resource.tenant_id || 'GLOBAL'
            });

            const allowed = await OpaService.check(input);

            if (allowed) {
                logger.info('✅ Acesso permitido pelo OPA');
                next();
            } else {
                logger.warn('❌ Acesso negado pelo OPA.', {
                    ...logContext,
                    opaDecision: 'FORBIDDEN',
                    requestedAction: input.action,
                });
                res.status(403).json({
                    error: 'Acesso negado',
                    details: `Sem permissão para ${input.action} em ${input.resource.type}`,
                    code: 'FORBIDDEN'
                });
            }
        } catch (error) {
            logger.error('💥 Erro fatal no middleware de autorização.', {
                ...logContext,
                message: error.message,
                stack: error.stack,
            });
            res.status(500).json({
                error: 'Erro interno na autorização',
                details: error.message
            });
        }
    };
};

export default { authorize };