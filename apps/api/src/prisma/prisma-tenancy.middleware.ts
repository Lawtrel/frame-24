
import { Prisma } from '@repo/db';
import { ClsService } from 'nestjs-cls';

export function PrismaTenancyMiddleware(cls: ClsService): any {
    return async (params: any, next: (params: any) => Promise<any>) => {
        const companyId = cls.get('companyId');
        const user = cls.get('user');

        // Bypass if no company context (e.g. public routes, background jobs without context)
        // Or if explicitly bypassed via a custom context flag if we implemented one
        if (!companyId) {
            return next(params);
        }

        // Models that should NOT be isolated or don't have company_id
        // We should ideally check DMMF, but for now we can use a blacklist or try-catch strategy
        // or better: assume all models except specific ones have company_id if the schema follows that pattern.
        // Looking at the schema, almost everything has company_id.
        // Exceptions: 'companies', 'users' (maybe), 'permissions' (has company_id), etc.
        // 'companies' table itself has 'id' which IS the company_id, so filtering by company_id might mean filtering by ID.

        const model = params.model;
        if (!model) return next(params);

        // Actions that support 'where'
        const findActions = ['findUnique', 'findFirst', 'findMany', 'count', 'aggregate', 'groupBy', 'findUniqueOrThrow', 'findFirstOrThrow'];
        const updateActions = ['update', 'updateMany', 'upsert', 'delete', 'deleteMany'];
        const createActions = ['create', 'createMany'];

        if (findActions.includes(params.action) || updateActions.includes(params.action)) {
            if (!params.args) {
                params.args = {};
            }
            if (params.args.where) {
                if (params.args.where.company_id === undefined) {
                    // Only inject if not explicitly set (allows system override if needed, though risky)
                    // For strict security, we should FORCE it.
                    // Let's force it for now, unless it's a Super Admin (which we don't have full context for here yet)

                    // Special case: 'companies' model. Filtering by company_id means filtering by 'id'
                    if (model === 'companies') {
                        params.args.where.id = companyId;
                    } else {
                        // We need to be sure the model has company_id. 
                        // Safe bet: most do. If not, this will throw.
                        // To be safer, we could check a whitelist/blacklist.
                        // Blacklist: 
                        const globalModels = ['logs', 'audit_logs']; // Add models without company_id here
                        if (!globalModels.includes(model)) {
                            params.args.where.company_id = companyId;
                        }
                    }
                }
            } else {
                params.args.where = {};
                if (model === 'companies') {
                    params.args.where.id = companyId;
                } else {
                    const globalModels = ['logs', 'audit_logs'];
                    if (!globalModels.includes(model)) {
                        params.args.where.company_id = companyId;
                    }
                }
            }
        }

        if (createActions.includes(params.action)) {
            if (!params.args) {
                params.args = {};
            }
            if (params.action === 'create') {
                if (!params.args.data.company_id && model !== 'companies') {
                    params.args.data.company_id = companyId;
                }
            }
            if (params.action === 'createMany') {
                if (Array.isArray(params.args.data)) {
                    params.args.data.forEach((item: any) => {
                        if (!item.company_id && model !== 'companies') {
                            item.company_id = companyId;
                        }
                    });
                }
            }
        }

        return next(params);
    };
}
