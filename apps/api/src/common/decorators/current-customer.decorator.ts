import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CustomerUser } from 'src/modules/identity/auth/strategies/jwt.strategy';

export const CurrentCustomer = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): CustomerUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
