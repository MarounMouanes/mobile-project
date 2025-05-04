import { Body, Controller, Post, UnauthorizedException, Get, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from './auth.guard';

class LoginDto {
  email: string;
  password: string;
}

class RegisterDto {
  name: string;
  email: string;
  password: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    try {
      return await this.authService.login(loginDto.email, loginDto.password);
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async register(@Body() registerDto: RegisterDto) {
    try {
      return await this.authService.register(
        registerDto.name,
        registerDto.email,
        registerDto.password,
      );
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  @Get('verify')
  @UseGuards(AuthGuard)
  async verifyToken(@Request() req) {
    return { 
      valid: true, 
      userId: req.user.id,
      username: req.user.name
    };
  }
} 