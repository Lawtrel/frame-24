import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { SignupDto } from '../dto/signup.dto';
import {
  LoginResponseDto,
  RegisterResponseDto,
} from '../dto/auth-response.dto';
import { VerifyEmailDto } from '../dto/verify-email.dto';
import {
  ForgotPasswordDto,
  ResetPasswordDto,
} from '../dto/forgot-password.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { AuthThrottle } from 'src/common/decorators/auth-throttle.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { RequestUser } from '../strategies/jwt.strategy';

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @AuthThrottle()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Cadastro de novo cliente (Empresa + Admin)',
    description:
      'Cria uma nova empresa e um usuário administrador. Use este endpoint para novos clientes se cadastrarem.',
  })
  @ApiResponse({
    status: 201,
    description: 'Empresa e usuário criados com sucesso',
    type: RegisterResponseDto,
  })
  @ApiConflictResponse({
    description: 'CNPJ ou email já cadastrado',
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos',
  })
  async signup(@Body() dto: SignupDto): Promise<RegisterResponseDto> {
    return this.authService.signup(dto);
  }

  @Public()
  @AuthThrottle()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login de usuário',
    description:
      'Autentica um usuário. Se tiver 1 empresa, retorna token direto. Se múltiplas, retorna lista para seleção.',
  })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
    type: LoginResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Credenciais inválidas ou conta bloqueada',
  })
  async login(@Body() dto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(dto.email, dto.password);
  }

  @Public()
  @AuthThrottle()
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
  })
  async register(@Body() dto: RegisterDto): Promise<RegisterResponseDto> {
    return this.authService.register(dto);
  }

  @Public()
  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verificar email',
    description:
      'Valida o token enviado por email, ativando a conta do usuário.',
  })
  @ApiResponse({
    status: 200,
    description: 'Email verificado com sucesso',
    schema: {
      example: {
        message: 'Email verificado com sucesso! Você já pode fazer login.',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Token inválido ou expirado',
  })
  async verifyEmail(@Body() dto: VerifyEmailDto): Promise<{ message: string }> {
    return this.authService.verifyEmail(dto.token);
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Solicitar reset de senha',
    description:
      'Envia email com link para redefinição de senha. Resposta sempre genérica para segurança.',
  })
  @ApiResponse({
    status: 200,
    description: 'Solicitação processada',
    schema: {
      example: {
        message:
          'Se um usuário com este email existir, um link para redefinição será enviado.',
      },
    },
  })
  async forgotPassword(
    @Body() dto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    await this.authService.requestPasswordReset(dto.email);
    return {
      message:
        'Se um usuário com este email existir, um link para redefinição será enviado.',
    };
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Redefinir senha',
    description:
      'Finaliza o processo de redefinição usando token recebido por email.',
  })
  @ApiResponse({
    status: 200,
    description: 'Senha redefinida com sucesso',
    schema: {
      example: {
        message: 'Sua senha foi redefinida com sucesso!',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Token inválido ou senha fora do padrão',
  })
  async resetPassword(
    @Body() dto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    return this.authService.resetPassword(dto.token, dto.password);
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Logout',
    description:
      'Revoga a sessão atual do usuário, invalidando o token JWT.',
  })
  @ApiResponse({
    status: 204,
    description: 'Logout realizado com sucesso',
  })
  @ApiUnauthorizedResponse({
    description: 'Token inválido ou expirado',
  })
  async logout(@CurrentUser() user: RequestUser): Promise<void> {
    await this.authService.logout(user.identity_id, user.company_id);
  }
}
