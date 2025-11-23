import { ClsService } from 'nestjs-cls';
import { tenancyLogic } from './prisma-tenancy.extension';
import { Prisma } from '@repo/db';

describe('PrismaTenancyExtension', () => {
  let clsService: ClsService;
  let queryMock: jest.Mock;

  beforeEach(() => {
    clsService = {
      get: jest.fn(),
    } as any;
    queryMock = jest.fn().mockResolvedValue('result');
  });

  const runOp = async (model: string, operation: string, args: any) => {
    return tenancyLogic(clsService, {
      model,
      operation,
      args,
      query: queryMock,
    });
  };

  it('should bypass if no companyId in context', async () => {
    (clsService.get as jest.Mock).mockReturnValue(undefined);
    const args = {};

    await runOp('test', 'findMany', args);

    expect(queryMock).toHaveBeenCalledWith(args);
    expect((args as any).where).toBeUndefined();
  });

  it('should inject companyId into findMany where clause', async () => {
    (clsService.get as jest.Mock).mockReturnValue('company-123');
    const args: any = {};

    await runOp('test', 'findMany', args);

    expect(args.where).toEqual({ company_id: 'company-123' });
  });

  it('should inject companyId into create data', async () => {
    (clsService.get as jest.Mock).mockReturnValue('company-123');
    const args: any = { data: { name: 'test' } };

    await runOp('test', 'create', args);

    expect(args.data.company_id).toBe('company-123');
  });

  it('should handle companies model specially (inject id)', async () => {
    (clsService.get as jest.Mock).mockReturnValue('company-123');
    const args: any = { where: {} };

    await runOp('companies', 'findUnique', args);

    expect(args.where.id).toBe('company-123');
    expect(args.where.company_id).toBeUndefined();
  });

  it('should not inject if model is in blacklist (logs)', async () => {
    (clsService.get as jest.Mock).mockReturnValue('company-123');
    const args: any = {};

    await runOp('logs', 'findMany', args);

    expect(args.where).toEqual({});
    expect(args.where.company_id).toBeUndefined();
  });
});
