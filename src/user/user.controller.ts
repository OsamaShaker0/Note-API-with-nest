import {
  Body,
  Controller,
  Req,
  Post,
  UseGuards,
  Get,
  Put,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AskForChangeDto } from './dto/AskForChange.dto';
import { AuthenticationGuard } from 'src/guards/guards.guard';
import { ChangeEmailDto } from './dto/ChangeEmail.dto';
import { ChangePasswordDto } from './dto/ChangePassword.dto';

@UseGuards(AuthenticationGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('get-me')
  getCurrentLoggedUser(@Req() req) {
    return this.userService.getUser(req);
  }

  @Post('change-email/request')
  changeEmailRequest(@Body() body: AskForChangeDto, @Req() req: Request) {
    return this.userService.askForChangeEmail(body, req);
  }

  @Post('change-email')
  changeEmail(@Body() body: ChangeEmailDto, @Req() req: Request) {
    return this.userService.changeEmail(body, req);
  }

  @Put('change-password')
  changeUserPassword(@Body() body: ChangePasswordDto, @Req() req: Request) {
    return this.userService.changeUserPassword(body, req);
  }

  @Delete('delete-user')
  DeleteCurrentLoginUser(@Req() req: Request) {
    return this.userService.deleteUser(req);
  }
}
