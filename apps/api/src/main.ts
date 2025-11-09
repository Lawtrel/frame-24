import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ZodValidationPipe } from 'nestjs-zod';
import { apiReference } from '@scalar/nestjs-api-reference';
import { Request, Response } from 'express';
import { AppModule } from './app.module';
// ERRO 1: Você esqueceu de importar TAG_GROUPS
import { getAllTags, TAG_GROUPS } from './swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use('/favicon.ico', (req: Request, res: Response) =>
    res.status(204).end(),
  );

  app.useGlobalPipes(new ZodValidationPipe());

  const configBuilder = new DocumentBuilder()
    .setTitle('Frame24 API')
    .setDescription(
      'API completa para gestão de cinemas multi-tenant com controle de usuários, permissões, vendas e operações.',
    )
    .setVersion('1.0.0')
    .setContact(
      'Frame24 Team',
      'https://frame24.com.br',
      'contato@frame24.com.br',
    )
    .addServer('http://localhost:4000', 'Desenvolvimento')
    .addServer('https://api.frame24.com.br', 'Produção')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Token JWT obtido no endpoint /auth/login',
      },
      'access-token',
    );

  getAllTags().forEach((tag) => configBuilder.addTag(tag));

  const config = configBuilder.build();

  // @ts-ignore
  config['x-tagGroups'] = TAG_GROUPS;

  const document = SwaggerModule.createDocument(app, config);

  app.use(
    '/api/docs',
    apiReference({
      content: document,
      theme: 'purple', // ou 'kepler', 'moon', 'default'
      layout: 'modern',
      darkMode: true,
      showSidebar: true,
      customCss: `
        .scalar-api-client__header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
      `,
    }),
  );

  await app.listen(4000);

  console.log('\nFrame24 API iniciada com sucesso!\n');
  console.log('Documentação Scalar:   http://localhost:4000/api/docs');
  console.log('API Base:              http://localhost:4000\n');
}

bootstrap();
