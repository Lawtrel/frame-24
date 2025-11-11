import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { SignupDtoSwagger } from '../dto/signup.dto';
import {
  LoginResponseDto,
  RegisterResponseDto,
} from '../dto/auth-response.dto';
import { VerifyEmailDto } from 'src/modules/identity/auth/dto/verify-email.dto';
import {
  ForgotPasswordDto,
  ResetPasswordDto,
} from 'src/modules/identity/auth/dto/password.dto';

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Cadastro de novo cliente (Empresa + Admin)',
    description:
      'Cria uma nova empresa e um usuário administrador. Use este endpoint para novos clientes se cadastrarem via landing page.',
  })
  @ApiResponse({
    status: 201,
    description: 'Empresa e usuário criados com sucesso',
    type: RegisterResponseDto,
  })
  @ApiConflictResponse({
    description: 'CNPJ ou email já cadastrado',
    schema: {
      example: {
        statusCode: 409,
        message: 'CNPJ já cadastrado no sistema.',
        error: 'Conflict',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos',
    schema: {
      example: {
        statusCode: 400,
        message: ['CNPJ inválido', 'Email deve ser um email válido'],
        error: 'Bad Request',
      },
    },
  })
  async signup(@Body() dto: SignupDtoSwagger): Promise<RegisterResponseDto> {
    return this.authService.signup(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login de usuário',
    description:
      'Autentica um usuário e retorna um token JWT válido por 1 hora.',
  })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
    type: LoginResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Credenciais inválidas ou conta bloqueada',
    schema: {
      example: {
        statusCode: 401,
        message: 'Credenciais inválidas.',
        error: 'Unauthorized',
      },
    },
  })
  async login(@Body() dto: LoginDto): Promise<LoginResponseDto> {
    const identity = await this.authService.validateUser(
      dto.email,
      dto.password,
      dto.company_id,
    );

    return this.authService.login(identity.id, dto.company_id);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Registro de usuário em empresa existente',
    description:
      'Adiciona um novo usuário a uma empresa já cadastrada. Use para funcionários convidados.',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
    type: RegisterResponseDto,
  })
  @ApiConflictResponse({
    description: 'Email já cadastrado nesta empresa',
    schema: {
      example: {
        statusCode: 409,
        message: 'Já existe um usuário com este email nesta empresa.',
        error: 'Conflict',
      },
    },
  })
  async register(@Body() dto: RegisterDto): Promise<RegisterResponseDto> {
    return this.authService.register(dto);
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verifica o e-mail do usuário usando um token',
    description:
      'Valida o token enviado para o e-mail do usuário após o cadastro, ativando a conta.',
  })
  @ApiResponse({
    status: 200,
    description: 'E-mail verificado com sucesso.',
    schema: {
      example: {
        message: 'Email verificado com sucesso! Você já pode fazer login.',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Token inválido, expirado ou e-mail já verificado.',
    schema: {
      example: {
        statusCode: 400,
        message: 'Token inválido ou expirado',
        error: 'Bad Request',
      },
    },
  })
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmail(dto.token);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Inicia o processo de redefinição de senha',
    description:
      'Recebe um e-mail e, se o usuário existir e estiver ativo, envia um link para redefinição de senha. A resposta é sempre a mesma para evitar a enumeração de e-mails.',
  })
  @ApiResponse({
    status: 200,
    description: 'Resposta genérica de sucesso.',
    schema: {
      example: {
        message:
          'Se um usuário com este e-mail existir, um link para redefinição de senha será enviado.',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'O e-mail fornecido não é válido.',
    schema: {
      example: {
        statusCode: 400,
        message: 'Por favor, forneça um e-mail válido.',
        error: 'Bad Request',
      },
    },
  })
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    await this.authService.requestPasswordReset(forgotPasswordDto.email);
    return {
      message:
        'Se um usuário com este e-mail existir, um link para redefinição de senha será enviado.',
    };
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Finaliza o processo de redefinição de senha',
    description:
      'Recebe um token de redefinição e uma nova senha para atualizar as credenciais do usuário.',
  })
  @ApiResponse({
    status: 200,
    description: 'Senha redefinida com sucesso.',
    schema: {
      example: {
        message: 'Sua senha foi redefinida com sucesso!',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Token inválido/expirado ou senha fora do padrão.',
    schema: {
      example: {
        statusCode: 400,
        message: 'Token de redefinição inválido ou expirado.',
        error: 'Bad Request',
      },
    },
  })
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    return this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.password,
    );
  }
}
