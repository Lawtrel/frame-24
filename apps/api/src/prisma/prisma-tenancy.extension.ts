import { Prisma } from '@repo/db';
import { ClsService } from 'nestjs-cls';

const COMPANY_SCOPED_MODELS = new Set<string>([
  'account_natures',
  'account_types',
  'accounting_movement_types',
  'accounts_payable',
  'accounts_receivable',
  'age_ratings',
  'audio_types',
  'audit_logs',
  'bank_accounts',
  'cash_flow_entries',
  'cast_types',
  'chart_of_accounts',
  'cinema_complexes',
  'combos',
  'company_customers',
  'company_users',
  'concession_status',
  'contingency_status',
  'contingency_types',
  'contract_types',
  'credit_types',
  'custom_roles',
  'departments',
  'distributor_settlement_status',
  'employees',
  'employment_contract_types',
  'federal_tax_rates',
  'journal_entry_status',
  'journal_entry_types',
  'media_types',
  'movie_categories',
  'movies',
  'municipal_tax_parameters',
  'payment_methods',
  'permissions',
  'positions',
  'product_categories',
  'product_prices',
  'products',
  'projection_types',
  'promotion_types',
  'promotional_campaigns',
  'recine_acquisition_types',
  'recine_deadline_types',
  'recine_item_types',
  'recine_project_status',
  'recine_project_types',
  'revenue_types',
  'sale_status',
  'sale_types',
  'seat_status',
  'seat_types',
  'session_languages',
  'session_status',
  'settlement_bases',
  'settlement_status',
  'simple_national_brackets',
  'state_icms_parameters',
  'stock_movement_types',
  'supplier_types',
  'suppliers',
  'tax_types',
  'ticket_types',
  'user_sessions',
]);

const WHERE_SCOPED_OPERATIONS = new Set<string>([
  'findFirst',
  'findMany',
  'count',
  'aggregate',
  'groupBy',
  'updateMany',
  'deleteMany',
]);

const CREATE_SCOPED_OPERATIONS = new Set<string>(['create', 'createMany']);

function objectHasCompanyId(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (Array.isArray(value))
    return value.some((item) => objectHasCompanyId(item));
  if (typeof value !== 'object') return false;

  const record = value as Record<string, unknown>;
  if (record.company_id !== undefined && record.company_id !== null)
    return true;

  return Object.values(record).some((item) => objectHasCompanyId(item));
}

export const tenancyLogic = async (
  cls: ClsService,
  {
    model,
    operation,
    args,
    query,
  }: { model: string; operation: string; args: any; query: any },
) => {
  const companyId = cls.get<string>('companyId');
  const modelIsCompanyScoped = COMPANY_SCOPED_MODELS.has(model);

  if (!args) {
    args = {} as any;
  }

  if (!companyId) {
    if (modelIsCompanyScoped) {
      const hasExplicitCompanyScope =
        objectHasCompanyId(args.where) || objectHasCompanyId(args.data);

      if (
        (WHERE_SCOPED_OPERATIONS.has(operation) ||
          CREATE_SCOPED_OPERATIONS.has(operation)) &&
        !hasExplicitCompanyScope
      ) {
        throw new Error(
          `[TENANCY] Missing company scope for ${model}.${operation}`,
        );
      }
    }
    return query(args);
  }

  if (model === 'companies' && WHERE_SCOPED_OPERATIONS.has(operation)) {
    if (!args.where) {
      args.where = {};
    }
    if (args.where.id === undefined) {
      args.where.id = companyId;
    }
  }

  if (modelIsCompanyScoped && WHERE_SCOPED_OPERATIONS.has(operation)) {
    if (!args.where) {
      args.where = {};
    }
    if (args.where.company_id === undefined) {
      args.where.company_id = companyId;
    }
  }

  if (modelIsCompanyScoped && CREATE_SCOPED_OPERATIONS.has(operation)) {
    if (operation === 'create') {
      if (!args.data) args.data = {};
      if (!args.data.company_id) {
        args.data.company_id = companyId;
      }
    }
    if (operation === 'createMany') {
      if (Array.isArray(args.data)) {
        args.data.forEach((item: any) => {
          if (!item.company_id) {
            item.company_id = companyId;
          }
        });
      } else if (args.data && typeof args.data === 'object') {
        if (!args.data.company_id) {
          args.data.company_id = companyId;
        }
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
