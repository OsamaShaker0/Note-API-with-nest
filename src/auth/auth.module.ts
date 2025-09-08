import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Utils } from 'src/utils/UtilsClass';

@Module({
  controllers: [AuthController],
  providers: [AuthService, Utils],
})
export class AuthModule {}
