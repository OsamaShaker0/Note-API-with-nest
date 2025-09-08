/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class Utils {
  constructor(
    private jwt: JwtService,
    private mailerService: MailerService,
  ) {}

  async HashPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }
  async comparePassword(inputPass, dbPass) {
    return await bcrypt.compare(inputPass, dbPass);
  }
  sendEmail(email: string, subject: string, token: string, why: string) {
    let htmlContent = '';
    if (why === 'verify-email') {
      htmlContent = `<p>Click <a href="${process.env.APP_URL}/auth/verify-email?token=${token}">here</a> to verify your email.</p>`;
    } else if (why === 'reset-password') {
      htmlContent = `<p>Click <a href="http://localhost:3000/auth/reset-password?token=${token}">here</a> to reset your password.</p>`;
    } else {
      htmlContent = `<p>${subject}</p>`;
    }

    this.mailerService.sendMail({
      to: email,
      subject: subject,
      html: htmlContent,
    });
  }
}
// dunction will code verifyresetpassword
