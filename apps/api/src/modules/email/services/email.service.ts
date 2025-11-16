import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { LoggerService } from 'src/common/services/logger.service';

@Injectable()
export class EmailService {
  private readonly frontendUrl =
    process.env.FRONTEND_URL || 'http://localhost:3003';
  private readonly brandName = 'Frame 24';
  private readonly brandColor = '#BF0603';
  private readonly successColor = '#28a745';
  private readonly supportEmail = 'suporte@frame24.com';

  constructor(
    private mailerService: MailerService,
    private logger: LoggerService,
  ) {}

  private createStyledEmail(
    title: string,
    preheader: string,
    content: string,
  ): string {
    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { margin: 0; padding: 0; background-color: #f4f4f7; }
          .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
          .header { background-color: ${this.brandColor}; color: #ffffff; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; }
          .content { padding: 30px; font-family: Arial, sans-serif; color: #333333; line-height: 1.6; }
          .content h2 { color: #333333; }
          .button { display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff !important; text-decoration: none; border-radius: 5px; font-weight: bold; }
          .link { color: #007bff; word-break: break-all; }
          .footer { background-color: #f4f4f7; color: #888888; text-align: center; padding: 20px; font-size: 12px; }
          .footer a { color: #888888; text-decoration: none; }
        </style>
      </head>
      <body>
        <span style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${preheader}</span>
        <div class="container">
          <div class="header">${this.brandName}</div>
          <div class="content">
            <h2>${title}</h2>
            ${content}
          </div>
          <div class="footer">
            <p>Se tiver alguma dúvida, responda a este e-mail ou contate nosso suporte em <a href="mailto:${this.supportEmail}">${this.supportEmail}</a>.</p>
            <p>&copy; ${new Date().getFullYear()} ${this.brandName}. Todos os direitos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  async sendVerificationEmail(
    email: string,
    name: string,
    token: string,
  ): Promise<void> {
    const verificationUrl = `${this.frontendUrl}/verify-email?token=${token}`;
    const title = `Olá, ${name}!`;
    const preheader = `Confirme seu e-mail para ativar sua conta no ${this.brandName}.`;
    const content = `
      <p>Obrigado por se cadastrar no ${this.brandName}! Para concluir seu registro e ativar sua conta, por favor, clique no botão abaixo.</p>
      <p style="text-align: center; margin: 30px 0;">
        <a href="${verificationUrl}" class="button" style="background-color: ${this.successColor};">Verificar E-mail</a>
      </p>
      <p>Se o botão não funcionar, copie e cole o seguinte link no seu navegador:</p>
      <p><a href="${verificationUrl}" class="link">${verificationUrl}</a></p>
      <p style="color: #888; font-size: 14px; margin-top: 30px;">Este link de verificação expira em 24 horas. Se você não criou esta conta, por favor, ignore este e-mail.</p>
    `;

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: `Confirme seu E-mail - ${this.brandName}`,
        html: this.createStyledEmail(title, preheader, content),
      });
      this.logger.log(`Verification email sent to ${email}`, 'EmailService');
    } catch (error) {
      this.logger.error(
        `Failed to send verification email to ${email}`,
        error instanceof Error ? error.stack : '',
        'EmailService',
      );
      throw error;
    }
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    const loginUrl = `${this.frontendUrl}/login`;
    const title = `Bem-vindo(a) ao ${this.brandName}, ${name}! 🎉`;
    const preheader = `Sua conta está pronta! Faça login para começar.`;
    const content = `
      <p>Seu e-mail foi verificado com sucesso e sua conta no ${this.brandName} está oficialmente ativa!</p>
      <p>Estamos muito felizes em ter você conosco. Agora você pode explorar todos os recursos que nossa plataforma oferece.</p>
      <p style="text-align: center; margin: 30px 0;">
        <a href="${loginUrl}" class="button" style="background-color: ${this.brandColor};">Fazer Login Agora</a>
      </p>
      <p>Bem-vindo(a) à comunidade ${this.brandName}!</p>
    `;

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: `Bem-vindo(a) ao ${this.brandName}! 🎬`,
        html: this.createStyledEmail(title, preheader, content),
      });
      this.logger.log(`Welcome email sent to ${email}`, 'EmailService');
    } catch (error) {
      this.logger.error(
        `Failed to send welcome email to ${email}`,
        error instanceof Error ? error.stack : '',
        'EmailService',
      );
      throw error;
    }
  }

  async sendPasswordResetEmail(
    email: string,
    name: string,
    token: string,
  ): Promise<void> {
    const resetUrl = `${this.frontendUrl}/reset-password?token=${token}`;
    const title = `Olá, ${name}!`;
    const preheader = `Recebemos uma solicitação para redefinir sua senha.`;
    const content = `
      <p>Recebemos uma solicitação para redefinir a senha da sua conta no ${this.brandName}.</p>
      <p>Clique no botão abaixo para escolher uma nova senha. Não se preocupe, sua senha atual permanecerá a mesma até que você a altere.</p>
      <p style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" class="button" style="background-color: ${this.brandColor};">Redefinir Senha</a>
      </p>
      <p>Se o botão não funcionar, copie e cole o seguinte link no seu navegador:</p>
      <p><a href="${resetUrl}" class="link">${resetUrl}</a></p>
      <p style="color: #888; font-size: 14px; margin-top: 30px;">Este link para redefinição de senha expira em 1 hora. Se você não solicitou isso, pode ignorar este e-mail com segurança.</p>
    `;

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: `Redefinir sua Senha - ${this.brandName}`,
        html: this.createStyledEmail(title, preheader, content),
      });
      this.logger.log(`Password reset email sent to ${email}`, 'EmailService');
    } catch (error) {
      this.logger.error(
        `Failed to send reset email to ${email}`,
        error instanceof Error ? error.stack : '',
        'EmailService',
      );
      throw error;
    }
  }
}
