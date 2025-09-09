/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import { RegisetrDto } from './dto/register.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { randomBytes } from 'crypto';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verifyEmail.dto';
import { Utils } from '../utils/UtilsClass';
import { why } from 'src/utils/whyEnum';
import { ForgetPasswordDto } from './dto/forgetPassword.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
@Injectable()
export class AuthService {
  constructor(
    private primsa: PrismaService,
    private jwt: JwtService,
    private mailerService: MailerService,
    private utils: Utils,
  ) {}
  async register(body: RegisetrDto) {
    // check inputs
    if (!body.name || !body.email || !body.password) {
      throw new BadRequestException();
    }
    let user = await this.primsa.user.findFirst({
      where: { email: body.email },
    });
    if (user) {
      throw new HttpException('User is alreday exist', 400);
    }
    const hashPassword = await this.utils.HashPassword(body.password);
    const verifyRegisterToken = randomBytes(32).toString('hex');
    user = await this.primsa.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashPassword,
        verifyRegisterToken,
      },
    });
    // send email
    this.utils.sendEmail(
      body.email,
      'Verify your Email',
      verifyRegisterToken,
      why.verifyEmail,
    );
    return {
      message: 'User created, please check your email for verification link.',
    };
  }

  async login(body: LoginDto) {
    if (!body.email || !body.password) {
      throw new BadRequestException();
    }
    const user = await this.primsa.user.findFirst({
      where: { email: body.email },
    });
    if (!user) {
      throw new NotFoundException();
    }
    if (!user.isVerified) {
      throw new UnauthorizedException('User email is not verified');
    }
    const isMatch = await this.utils.comparePassword(
      body.password,
      user.password,
    );

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = this.jwt.sign({
      id: user.id,
      email: body.email,
      name: user.name,
    });
    return { token };
  }
  async verifyEamil(body: VerifyEmailDto, token: string) {
    const user = await this.primsa.user.findFirst({
      where: { email: body.email },
    });
    if (!user || user.verifyRegisterToken !== token) {
      throw new UnauthorizedException('Invalid credentials');
    }
    await this.primsa.user.update({
      where: { id: user.id },
      data: { verifyRegisterToken: null, isVerified: true },
    });
    return { msg: 'User Is verified' };
  }
  async forgetPassword(body: ForgetPasswordDto) {
    if (!body.email) {
      throw new BadRequestException();
    }
    const user = await this.primsa.user.findFirst({
      where: { email: body.email },
    });
    if (!user || !user.isVerified) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const verifyForgetPasswordToken = randomBytes(32).toString('hex');
    await this.primsa.user.update({
      where: { id: user.id },
      data: { verifyForgetPasswordToken },
    });
    this.utils.sendEmail(
      body.email,
      'Reset Your Password',
      verifyForgetPasswordToken,
      why.resetPassword,
    );
    return {
      message: 'Please check your email for verification link.',
    };
  }
  async resetPassword(body: ResetPasswordDto, token: string) {
    if (!body.password) {
      throw new BadRequestException();
    }
    const user = await this.primsa.user.findFirst({
      where: { verifyForgetPasswordToken: token },
    });
    if (!user || !user.isVerified) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const hashPassword = await this.utils.HashPassword(body.password);
    await this.primsa.user.update({
      where: { id: user.id },
      data: { password: hashPassword, verifyForgetPasswordToken: null },
    });
    return {
      message: 'Your Password is Changed ',
    };
  }
}
