import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Utils } from 'src/utils/UtilsClass';

@Module({
  controllers: [UserController],
  providers: [UserService, Utils],
})
export class UserModule {}
