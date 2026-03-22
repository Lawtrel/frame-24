import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common';
import { PrismaClient, getPrismaClientOptions } from '@repo/db';
import { ClsService } from 'nestjs-cls';
import { tenancyExtension } from './prisma-tenancy.extension';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private _extendedClient: Record<PropertyKey, unknown> | null = null;

  constructor(private readonly cls: ClsService) {
    super(getPrismaClientOptions());
    return new Proxy(this, {
      get: (target, prop, receiver) => {
        if (this._extendedClient && prop in this._extendedClient) {
          return this._extendedClient[prop];
        }
        return Reflect.get(target, prop, receiver);
      },
    });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
    this._extendedClient = this.$extends(tenancyExtension(this.cls)) as Record<
      PropertyKey,
      unknown
    >;
  }

  enableShutdownHooks(app: INestApplication): void {
    process.on('SIGTERM', () => {
      void (async () => {
        await this.$disconnect();
        await app.close();
      })();
    });
  }
}
