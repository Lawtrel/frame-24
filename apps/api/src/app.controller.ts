import { Controller, Get, Redirect } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Redirect('/api/docs', 302)
  getRoot() {
    // Redireciona para a documentação
    return;
  }

  @Get('health')
  healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'Frame24 API',
      version: '1.0.0',
    };
  }
}
