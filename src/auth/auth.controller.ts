import {
  Body,
  Controller,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisetrDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verifyEmail.dto';
import { ForgetPasswordDto } from './dto/forgetPassword.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { ApiTags, ApiOperation, ApiBody, ApiQuery } from '@nestjs/swagger';
@ApiTags('Auth')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller('auth')
export class AuthController {
  constructor(private authSerivce: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisetrDto })
  regisetrUser(@Body() body: RegisetrDto) {
    return this.authSerivce.register(body);
  }
  @Post('login')
  @ApiOperation({ summary: 'Login and get JWT token' })
  @ApiBody({ type: LoginDto })
  loginUser(@Body() body: LoginDto) {
    return this.authSerivce.login(body);
  }
  @Post('verify-email')
  @ApiOperation({ summary: 'Verify user email with token' })
  @ApiBody({ type: VerifyEmailDto })
  verifyUserEmail(@Body() body: VerifyEmailDto, @Query('token') token: string) {
    return this.authSerivce.verifyEamil(body, token);
  }
  @Post('forget-password')
  @ApiOperation({ summary: 'Send reset password email' })
  @ApiBody({ type: ForgetPasswordDto })
  @ApiQuery({ name: 'token', type: String, required: true })
  forgetassowrd(@Body() body: ForgetPasswordDto) {
    return this.authSerivce.forgetPassword(body);
  }
  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiQuery({ name: 'token', type: String, required: true })
  resetPassword(@Body() body: ResetPasswordDto, @Query('token') token: string) {
    return this.authSerivce.resetPassword(body, token);
  }
}
