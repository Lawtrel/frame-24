import { Prisma } from '@repo/db';
import { SnowflakeService } from 'src/common/services/snowflake.service';

const SNOWFLAKE_FIRST_MODELS = new Set<string>([
  'account_natures',
  'account_types',
  'accounting_movement_types',
  'accounts_payable',
  'accounts_receivable',
  'age_ratings',
  'audio_types',
  'bank_accounts',
  'bank_reconciliations',
  'campaign_categories',
  'campaign_complexes',
  'campaign_movies',
  'campaign_rooms',
  'campaign_session_types',
  'campaign_weekdays',
  'cash_flow_entries',
  'cast_types',
  'chart_of_accounts',
  'cinema_complexes',
  'combo_products',
  'combos',
  'companies',
  'company_customers',
  'company_users',
  'concession_sale_items',
  'concession_sales',
  'concession_status',
  'contingency_reserves',
  'contingency_status',
  'contingency_types',
  'contract_types',
  'courtesy_parameters',
  'credit_types',
  'custom_roles',
  'customer_favorite_combos',
  'customer_favorite_genres',
  'customer_favorite_products',
  'customer_interactions',
  'customer_points',
  'customer_preferences',
  'customer_preferred_rows',
  'customer_preferred_times',
  'customer_preferred_weekdays',
  'customers',
  'departments',
  'distributor_settlement_status',
  'distributor_settlements',
  'employees',
  'employment_contract_types',
  'exhibition_contract_sliding_scales',
  'exhibition_contracts',
  'federal_tax_rates',
  'identities',
  'iss_withholdings',
  'journal_entries',
  'journal_entry_items',
  'journal_entry_status',
  'journal_entry_types',
  'media_types',
  'monthly_income_statement',
  'monthly_tax_settlement',
  'movie_cast',
  'movie_categories',
  'movie_media',
  'movies',
  'municipal_tax_parameters',
  'payable_transactions',
  'payment_methods',
  'permissions',
  'persons',
  'pis_cofins_credits',
  'positions',
  'product_categories',
  'product_prices',
  'product_stock',
  'products',
  'projection_types',
  'promotion_types',
  'promotional_campaigns',
  'promotions_used',
  'receivable_transactions',
  'recine_acquisition_types',
  'recine_acquisitions',
  'recine_deadline_types',
  'recine_deadlines',
  'recine_item_types',
  'recine_project_status',
  'recine_project_types',
  'recine_projects',
  'revenue_types',
  'role_permissions',
  'rooms',
  'sale_status',
  'sale_types',
  'sales',
  'seat_status',
  'seat_types',
  'seats',
  'session_languages',
  'session_seat_status',
  'session_status',
  'settlement_bases',
  'settlement_status',
  'showtime_schedule',
  'simple_national_brackets',
  'state_icms_parameters',
  'stock_movement_types',
  'stock_movements',
  'supplier_types',
  'suppliers',
  'tax_compensations',
  'tax_entries',
  'tax_types',
  'ticket_types',
  'tickets',
  'user_attributes',
]);

type CreateArgs = {
  data?: Record<string, unknown>;
};

type CreateManyArgs = {
  data?: Record<string, unknown> | Record<string, unknown>[];
};

function shouldAssignSnowflakeId(model: string | undefined): boolean {
  return !!model && SNOWFLAKE_FIRST_MODELS.has(model);
}

function injectId(
  payload: Record<string, unknown>,
  generate: () => string,
): Record<string, unknown> {
  if (payload.id !== undefined && payload.id !== null && payload.id !== '') {
    return payload;
  }

  return {
    ...payload,
    id: generate(),
  };
}

export const snowflakeIdExtension = (snowflake: SnowflakeService) =>
  Prisma.defineExtension({
    name: 'snowflake-id-extension',
    query: {
      $allModels: {
        async create({ model, args, query }) {
          if (!shouldAssignSnowflakeId(model)) {
            return query(args);
          }

          const typedArgs = args as CreateArgs;
          if (!typedArgs.data || typeof typedArgs.data !== 'object') {
            return query(args);
          }

          typedArgs.data = injectId(typedArgs.data, () => snowflake.generate());
          return query(args);
        },

        async createMany({ model, args, query }) {
          if (!shouldAssignSnowflakeId(model)) {
            return query(args);
          }

          const typedArgs = args as CreateManyArgs;
          const { data } = typedArgs;

          if (!data) {
            return query(args);
          }

          if (Array.isArray(data)) {
            typedArgs.data = data.map((item) =>
              injectId(item, () => snowflake.generate()),
            );
            return query(args);
          }

          typedArgs.data = injectId(data, () => snowflake.generate());
          return query(args);
        },
      },
    },
  });
