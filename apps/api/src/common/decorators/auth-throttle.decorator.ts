import { Throttle, SkipThrottle as NestSkipThrottle } from '@nestjs/throttler';

export const AuthThrottle = () => Throttle({ auth: { ttl: 60000, limit: 10 } });
/** Cadastro público de empresa (alto risco de abuso). */
export const SignupThrottle = () =>
  Throttle({ signup: { ttl: 60000, limit: 5 } });
/** Cadastro de cliente final por empresa. */
export const CustomerSignupThrottle = () =>
  Throttle({ customerSignup: { ttl: 60000, limit: 8 } });
/** Vinculação / ativação de conta (provisioning leve). */
export const ProvisioningThrottle = () =>
  Throttle({ provisioning: { ttl: 60000, limit: 15 } });
export const PublicReadThrottle = () =>
  Throttle({ public: { ttl: 60000, limit: 300 } });
export const WriteThrottle = () =>
  Throttle({ write: { ttl: 60000, limit: 30 } });

// Re-export the official SkipThrottle from @nestjs/throttler
export const SkipThrottle = NestSkipThrottle;
