import { Prisma } from '@repo/db';
import { ClsService } from 'nestjs-cls';

export const tenancyLogic = async (
  cls: ClsService,
  {
    model,
    operation,
    args,
    query,
  }: { model: string; operation: string; args: any; query: any },
) => {
  const companyId = cls.get('companyId');

  if (!companyId) {
    return query(args);
  }

  // Actions that support 'where'
  const findActions = [
    'findUnique',
    'findFirst',
    'findMany',
    'count',
    'aggregate',
    'groupBy',
    'findUniqueOrThrow',
    'findFirstOrThrow',
  ];
  const updateActions = [
    'update',
    'updateMany',
    'upsert',
    'delete',
    'deleteMany',
  ];
  const createActions = ['create', 'createMany'];

  // Initialize args if undefined
  if (!args) {
    args = {} as any;
  }

  if (findActions.includes(operation) || updateActions.includes(operation)) {
    if (!args.where) {
      args.where = {};
    }

    // Special case: 'companies' model filters by 'id'
    if (model === 'companies') {
      if (args.where.id === undefined) {
        args.where.id = companyId;
      }
    } else {
      // Global models blacklist
      const globalModels = ['logs', 'audit_logs'];
      if (!globalModels.includes(model)) {
        if (args.where.company_id === undefined) {
          args.where.company_id = companyId;
        }
      }
    }
  }

  if (createActions.includes(operation)) {
    if (operation === 'create') {
      if (!args.data) args.data = {};
      if (!args.data.company_id && model !== 'companies') {
        args.data.company_id = companyId;
      }
    }
    if (operation === 'createMany') {
      if (Array.isArray(args.data)) {
        args.data.forEach((item: any) => {
          if (!item.company_id && model !== 'companies') {
            item.company_id = companyId;
          }
        });
      }
    }
  }

  return query(args);
};

export const tenancyExtension = (cls: ClsService) => {
  return Prisma.defineExtension({
    name: 'tenancy-extension',
    query: {
      $allModels: {
        async $allOperations(params) {
          return tenancyLogic(cls, params as any);
        },
      },
    },
  });
};
