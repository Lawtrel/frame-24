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

@ApiTags('Auth')
@Controller('auth')
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
  @ApiOperation({ summary: 'Verificar email com token' })
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmail(dto.token);
  }
}
