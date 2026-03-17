import type { RequestUser } from 'src/modules/identity/auth/strategies/jwt.strategy';
import type { OperationTypeResponse } from '../../shared/dto/operation-type-response.dto';
import { SeatTypesService } from '../services/seat-types.service';
import { SeatTypesController } from './seat-types.controller';

describe('SeatTypesController', () => {
  it('deve listar tipos de assento da empresa do usuario logado', async () => {
    const response: OperationTypeResponse[] = [
      {
        id: 'seat-type-1',
        name: 'VIP',
        description: null,
        additional_value: '8.00',
      },
    ];

    const service: Pick<SeatTypesService, 'findAll'> = {
      findAll: jest.fn().mockResolvedValue(response),
    };

    const controller = new SeatTypesController(service as SeatTypesService);
    const user = { company_id: 'company-123' } as RequestUser;

    const result = await controller.findAll(user);

    expect(service.findAll).toHaveBeenCalledWith('company-123');
    expect(result).toEqual(response);
  });
});
