import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ZodValidationPipe } from 'nestjs-zod';
import { apiReference } from '@scalar/nestjs-api-reference';
import { Request, Response } from 'express';
import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from './app.module';
import { getAllTags, TAG_GROUPS } from './swagger.config';
import { VersioningType } from '@nestjs/common';
import { validateEnvironment } from './config/validate-env';

async function bootstrap() {
  validateEnvironment();
  const app = await NestFactory.create(AppModule);

  // Enable compression
  app.use(compression());

  // Security: HTTP headers protection
  // CSP desabilitado apenas em dev para Swagger/Scalar funcionar
  const isDev = process.env.NODE_ENV !== 'production';
  app.use(
    helmet({
      contentSecurityPolicy: isDev ? false : undefined,
      crossOriginEmbedderPolicy: isDev ? false : undefined,
    }),
  );

  // Configuração de CORS segura
  const frontendUrls = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',').map((url) => url.trim())
    : [];

  const devOrigins = isDev
    ? [
        'http://localhost:3000',
        'http://localhost:3002',
        'http://localhost:3004',
        'http://localhost:4000',
      ]
    : [];

  const allowedOrigins = [...devOrigins, ...frontendUrls].filter(Boolean);

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      // Permite requisições sem origin (Postman, mobile apps, server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`CORS blocked origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'User-Agent',
      'Authorization',
      'x-customer-id',
    ],
  });

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
    .addServer('https://api.frame24.com.br', 'Produção');

  // Adicionar servidor atual dinamicamente se não for localhost ou produção
  if (
    process.env.API_URL &&
    process.env.API_URL !== 'http://localhost:4000' &&
    process.env.API_URL !== 'https://api.frame24.com.br'
  ) {
    configBuilder.addServer(process.env.API_URL, 'Ambiente Atual');
  }

  configBuilder.addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      description: 'Token JWT obtido no endpoint /auth/login',
    },
    'access-token',
  );
  app.enableVersioning({
    type: VersioningType.URI,
  });

  getAllTags().forEach((tag) => configBuilder.addTag(tag));

  const config = configBuilder.build();

  // @ts-expect-error - Swagger config doesn't have x-tagGroups in types but it's valid
  config['x-tagGroups'] = TAG_GROUPS;

  const document = SwaggerModule.createDocument(app, config);

  app
    .getHttpAdapter()
    .get('/api/openapi.json', (req: Request, res: Response) => {
      res.json(document);
    });

  app.use(
    '/api/docs',
    apiReference({
      content: document,
      theme: 'purple',
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

  const port = process.env.PORT || 4000;
  await app.listen(port);

  console.log('\nFrame24 API iniciada com sucesso!\n');
  console.log(`Documentação Scalar:   http://localhost:${port}/api/docs`);
  console.log(
    `OpenAPI JSON:          http://localhost:${port}/api/openapi.json`,
  );
  console.log(`API Base:              http://localhost:${port}\n`);
}

void bootstrap();
