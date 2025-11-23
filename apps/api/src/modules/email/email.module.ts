import { Module } from '@nestjs/common';

import { EmailService } from './services/email.service';
import { IdentityEmailConsumer } from './consumers/identity-email.consumer';

@Module({
  imports: [],
  providers: [
    EmailService,
    IdentityEmailConsumer,
    {
      provide: 'RESEND_CLIENT',
      useFactory: () => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { Resend } = require('resend');
        return new Resend(process.env.RESEND_API_KEY || 're_disabled');
      },
    },
  ],
  exports: [EmailService],
})
export class EmailModule {}
