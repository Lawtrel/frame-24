import { Throttle, SkipThrottle as NestSkipThrottle } from '@nestjs/throttler';

export const AuthThrottle = () => Throttle({ auth: { ttl: 60000, limit: 10 } });

// Re-export the official SkipThrottle from @nestjs/throttler
export const SkipThrottle = NestSkipThrottle;
