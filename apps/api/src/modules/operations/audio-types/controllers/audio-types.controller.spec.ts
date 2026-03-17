import type { RequestUser } from 'src/modules/identity/auth/strategies/jwt.strategy';
import type { OperationTypeResponse } from '../../shared/dto/operation-type-response.dto';
import { AudioTypesService } from '../services/audio-types.service';
import { AudioTypesController } from './audio-types.controller';

describe('AudioTypesController', () => {
  it('deve listar tipos de audio da empresa do usuario logado', async () => {
    const response: OperationTypeResponse[] = [
      {
        id: 'audio-1',
        name: 'Dolby Atmos',
        description: null,
        additional_value: '12.50',
      },
    ];

    const service: Pick<AudioTypesService, 'findAll'> = {
      findAll: jest.fn().mockResolvedValue(response),
    };

    const controller = new AudioTypesController(service as AudioTypesService);
    const user = { company_id: 'company-123' } as RequestUser;

    const result = await controller.findAll(user);

    expect(service.findAll).toHaveBeenCalledWith('company-123');
    expect(result).toEqual(response);
  });
});
