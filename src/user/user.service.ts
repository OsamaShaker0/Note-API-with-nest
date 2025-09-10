/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  Body,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Utils } from 'src/utils/UtilsClass';
import { AskForChangeDto } from './dto/AskForChange.dto';
import { randomBytes } from 'crypto';
import { why } from 'src/utils/whyEnum';
import { ChangeEmailDto } from './dto/ChangeEmail.dto';
import { ChangePasswordDto } from './dto/ChangePassword.dto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private utils: Utils,
  ) {}
  async askForChangeEmail(body: AskForChangeDto, req) {
    if (!body.newEmail) {
      throw new BadRequestException();
    }

    const verifyOldEmailToken = randomBytes(32).toString('hex');
    const verifyNewEmailToken = randomBytes(32).toString('hex');
    let user;
    try {
      user = await this.prisma.user.update({
        where: { id: req.user.id },
        data: {
          verifyOldEmailToken,
          verifyNewEmailToken,
          newEmail: body.newEmail,
        },
      });
    } catch (err) {
      throw new InternalServerErrorException(
        'Could not update user with verification tokens',
      );
    }
    await Promise.all([
      this.utils.sendEmail(
        user.email,
        'Verify Change Email',
        verifyOldEmailToken,
        why.verifyChangeEmail,
      ),
      this.utils.sendEmail(
        body.newEmail,
        'Verify Change Email',
        verifyNewEmailToken,
        why.verifyChangeEmail,
      ),
    ]);

    return {
      message: 'Verification tokens generated. Please check your email inbox.',
    };
  }
  async changeEmail(body: ChangeEmailDto, req) {
    if (!body.oldEmailToken || !body.newEmailToken) {
      throw new BadRequestException('Missing Values');
    }
    const user = await this.prisma.user.findUnique({
      where: { id: req.user.id },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    if (!user.newEmail) {
      throw new BadRequestException('No pending email change request');
    }
    if (
      user?.verifyOldEmailToken !== body.oldEmailToken ||
      user?.verifyNewEmailToken !== body.newEmailToken
    ) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    await this.prisma.user.update({
      where: { id: req.user.id },
      data: {
        verifyOldEmailToken: null,
        verifyNewEmailToken: null,
        email: user.newEmail,
        newEmail: null,
      },
    });
    return { msg: 'Email Changed ' };
  }
  getUser(req) {
    const user = {
      name: req.user?.name,
      email: req.user.email,
      id: req.user.id,
    };
    return user;
  }
  async changeUserPassword(body: ChangePasswordDto, req) {
    if (!body.oldPassword || !body.newPassword) {
      throw new BadRequestException('Missing values');
    }
    const user = await this.prisma.user.findUnique({
      where: { id: req.user.id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isMatch = await this.utils.comparePassword(
      body.oldPassword,
      user.password,
    );
    if (!isMatch) {
      throw new UnauthorizedException('Old password is incorrect');
    }
    const isSamePassword = await this.utils.comparePassword(
      body.newPassword,
      user.password,
    );
    if (isSamePassword) {
      throw new BadRequestException(
        'New password cannot be the same as old password',
      );
    }
    const hashNewPassword = await this.utils.HashPassword(body.newPassword);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: hashNewPassword },
    });
    await this.utils.sendEmail(
      user.email,
      'change password',
      '',
      why.changePassword,
    );
    return { msg: 'Your password has changed successfully' };
  }
  async deleteUser(req) {
    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.note.deleteMany({
          where: { userId: req.user.id },
        });

        await tx.user.delete({
          where: { id: req.user.id },
        });
      });

      return { message: 'User deleted along with all notes' };
    } catch (error) {
      throw new NotFoundException('User not found or already deleted');
    }
  }
}
