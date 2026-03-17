import type { RequestUser } from 'src/modules/identity/auth/strategies/jwt.strategy';
import type { SessionLanguageResponse } from '../../shared/dto/session-language-response.dto';
import { SessionLanguagesService } from '../services/session-languages.service';
import { SessionLanguagesController } from './session-languages.controller';

describe('SessionLanguagesController', () => {
  it('deve listar linguagens de sessao da empresa do usuario logado', async () => {
    const response: SessionLanguageResponse[] = [
      {
        id: 'language-1',
        name: 'Portugues',
        description: null,
        abbreviation: 'PT-BR',
      },
    ];

    const service: Pick<SessionLanguagesService, 'findAll'> = {
      findAll: jest.fn().mockResolvedValue(response),
    };

    const controller = new SessionLanguagesController(
      service as SessionLanguagesService,
    );
    const user = { company_id: 'company-123' } as RequestUser;

    const result = await controller.findAll(user);

    expect(service.findAll).toHaveBeenCalledWith('company-123');
    expect(result).toEqual(response);
  });
});
