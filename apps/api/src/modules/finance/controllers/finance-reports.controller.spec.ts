import { FinanceReportsController } from './finance-reports.controller';
import { FinanceReportsService } from '../services/finance-reports.service';

describe('FinanceReportsController', () => {
  let controller: FinanceReportsController;
  let service: jest.Mocked<FinanceReportsService>;

  beforeEach(() => {
    service = {
      getIncomeStatement: jest.fn(),
    } as unknown as jest.Mocked<FinanceReportsService>;

    controller = new FinanceReportsController(service);
  });

  it('should delegate monthly DRE query to service', async () => {
    service.getIncomeStatement.mockResolvedValue({ period: '2026-03' } as never);

    const result = await controller.getIncomeStatement('2026-03');

    expect(service.getIncomeStatement).toHaveBeenCalledWith('2026-03');
    expect(result).toEqual({ period: '2026-03' });
  });
});
