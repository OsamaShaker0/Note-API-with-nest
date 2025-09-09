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

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller('auth')
export class AuthController {
  constructor(private authSerivce: AuthService) {}

  @Post('register')
  regisetrUser(@Body() body: RegisetrDto) {
    return this.authSerivce.register(body);
  }
  @Post('login')
  loginUser(@Body() body: LoginDto) {
    return this.authSerivce.login(body);
  }
  @Post('verify-email')
  verifyUserEmail(@Body() body: VerifyEmailDto, @Query('token') token: string) {
    return this.authSerivce.verifyEamil(body, token);
  }
  @Post('forget-password')
  forgetassowrd(@Body() body: ForgetPasswordDto) {
    return this.authSerivce.forgetPassword(body);
  }
  @Post('reset-password')
  resetPassword(@Body() body: ResetPasswordDto, @Query('token') token: string) {
    return this.authSerivce.resetPassword(body, token);
  }
}
