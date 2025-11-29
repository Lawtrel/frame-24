import { SetMetadata } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';


export const AuthThrottle = () =>
    Throttle({ auth: { ttl: 60000, limit: 10 } });

export const SkipThrottle = () => SetMetadata('skipThrottle', true);
