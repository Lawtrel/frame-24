import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './services/email.service';
import { IdentityEmailConsumer } from './consumers/identity-email.consumer';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST || 'localhost',
        port: Number(process.env.SMTP_PORT) || 1025,
        secure: process.env.SMTP_SECURE === 'true',
        ...(process.env.SMTP_USER &&
          process.env.SMTP_PASS && {
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
          }),
      },
      defaults: {
        from: `"${process.env.APP_NAME || 'Frame 24'}" <${process.env.SMTP_FROM || 'noreply@frame24.local'}>`,
      },
    }),
  ],
  providers: [EmailService, IdentityEmailConsumer],
  exports: [EmailService],
})
export class EmailModule {}
