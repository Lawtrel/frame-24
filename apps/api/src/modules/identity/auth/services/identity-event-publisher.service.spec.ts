import { Test, TestingModule } from '@nestjs/testing';
import { IdentityEventPublisherService } from './identity-event-publisher.service';
import { RabbitMQPublisherService } from 'src/common/rabbitmq/rabbitmq-publisher.service';
import { IdentityEventPattern } from 'src/modules/identity/events/identity.events';

describe('IdentityEventPublisherService', () => {
  let service: IdentityEventPublisherService;
  let rabbitmqService: jest.Mocked<RabbitMQPublisherService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IdentityEventPublisherService,
        {
          provide: RabbitMQPublisherService,
          useValue: {
            publish: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<IdentityEventPublisherService>(
      IdentityEventPublisherService,
    );
    rabbitmqService = module.get(RabbitMQPublisherService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('publishCreated', () => {
    const testData = {
      identityId: 'id-123',
      email: 'novo@example.com',
      fullName: 'João Novo',
      verificationToken: 'token-abc',
    };

    it('deve publicar evento de criação de identidade', async () => {
      await service.publishCreated(testData);

      expect(rabbitmqService.publish).toHaveBeenCalled();
    });

    it('deve usar o pattern IdentityEventPattern.CREATED', async () => {
      await service.publishCreated(testData);

      expect(rabbitmqService.publish).toHaveBeenCalledWith(
        expect.objectContaining({
          pattern: IdentityEventPattern.CREATED,
        }),
      );
    });

    it('deve mapear os dados corretamente para o evento', async () => {
      await service.publishCreated(testData);

      expect(rabbitmqService.publish).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            identity_id: 'id-123',
            email: 'novo@example.com',
            full_name: 'João Novo',
            verification_token: 'token-abc',
          },
        }),
      );
    });

    it('deve gerar e incluir um correlationId', async () => {
      await service.publishCreated(testData);

      expect(rabbitmqService.publish).toHaveBeenCalledWith(
        expect.objectContaining({
          metadata: {
            correlationId: expect.any(String),
          },
        }),
      );
    });
  });

  describe('publishVerified', () => {
    const testData = {
      identityId: 'id-123',
      email: 'verificado@example.com',
      fullName: 'João Verificado',
    };

    it('deve publicar evento de identidade verificada', async () => {
      await service.publishVerified(testData);

      expect(rabbitmqService.publish).toHaveBeenCalled();
    });

    it('deve usar o pattern IdentityEventPattern.VERIFIED', async () => {
      await service.publishVerified(testData);

      expect(rabbitmqService.publish).toHaveBeenCalledWith(
        expect.objectContaining({
          pattern: IdentityEventPattern.VERIFIED,
        }),
      );
    });

    it('deve mapear os dados corretamente para o evento', async () => {
      await service.publishVerified(testData);

      expect(rabbitmqService.publish).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            identity_id: 'id-123',
            email: 'verificado@example.com',
            full_name: 'João Verificado',
          },
        }),
      );
    });
  });

  describe('publishPasswordReset', () => {
    const testData = {
      identityId: 'id-123',
      email: 'reset@example.com',
      fullName: 'João Reset',
      resetToken: 'token-xyz',
    };

    it('deve publicar evento de reset de senha', async () => {
      await service.publishPasswordReset(testData);

      expect(rabbitmqService.publish).toHaveBeenCalled();
    });

    it('deve usar o pattern IdentityEventPattern.PASSWORD_RESET', async () => {
      await service.publishPasswordReset(testData);

      expect(rabbitmqService.publish).toHaveBeenCalledWith(
        expect.objectContaining({
          pattern: IdentityEventPattern.PASSWORD_RESET,
        }),
      );
    });

    it('deve mapear os dados corretamente para o evento', async () => {
      await service.publishPasswordReset(testData);

      expect(rabbitmqService.publish).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            identity_id: 'id-123',
            email: 'reset@example.com',
            full_name: 'João Reset',
            reset_token: 'token-xyz',
          },
        }),
      );
    });
  });

  describe('generateCorrelationId', () => {
    it('deve gerar um ID de correlação único', () => {
      const id1 = service.generateCorrelationId();
      const id2 = service.generateCorrelationId();

      expect(id1).not.toEqual(id2);
      expect(typeof id1).toBe('string');
      expect(id1.length).toBeGreaterThan(10);
    });
  });
});
