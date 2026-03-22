import { CustomerAuthController } from './customer-auth.controller';
import { CustomerAuthService } from '../services/customer-auth.service';

describe('CustomerAuthController', () => {
  let controller: CustomerAuthController;
  let service: jest.Mocked<CustomerAuthService>;

  beforeEach(() => {
    service = {
      register: jest.fn(),
      login: jest.fn(),
    } as unknown as jest.Mocked<CustomerAuthService>;

    controller = new CustomerAuthController(service);
  });

  it('should delegate register to service', async () => {
    const dto = {
      company_id: 'company-1',
      email: 'maria@x.com',
      cpf: '12345678900',
      full_name: 'Maria',
      phone: '11999999999',
      password: 'StrongPass123!',
    };
    service.register.mockResolvedValue({ access_token: 'token' } as never);

    const result = await controller.register(dto as any);

    expect(service.register).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ access_token: 'token' });
  });

  it('should delegate login to service', async () => {
    const dto = {
      company_id: 'company-1',
      email: 'maria@x.com',
      password: 'StrongPass123!',
    };
    service.login.mockResolvedValue({ access_token: 'token' } as never);

    const result = await controller.login(dto as any);

    expect(service.login).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ access_token: 'token' });
  });
});
