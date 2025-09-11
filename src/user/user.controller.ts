import {
  Body,
  Controller,
  Req,
  Post,
  UseGuards,
  Get,
  Put,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AskForChangeDto } from './dto/AskForChange.dto';
import { AuthenticationGuard } from 'src/guards/guards.guard';
import { ChangeEmailDto } from './dto/ChangeEmail.dto';
import { ChangePasswordDto } from './dto/ChangePassword.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth('access-token')
@UseGuards(AuthenticationGuard)
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('get-me')
  @ApiOperation({ summary: 'Get current logged-in user' })
  getCurrentLoggedUser(@Req() req) {
    return this.userService.getUser(req);
  }

  @Post('change-email/request')
  @ApiOperation({
    summary: 'Request to change email (send verification tokens)',
  })
  @ApiBody({ type: AskForChangeDto })
  changeEmailRequest(@Body() body: AskForChangeDto, @Req() req: Request) {
    return this.userService.askForChangeEmail(body, req);
  }

  @Post('change-email')
  @ApiOperation({ summary: 'Confirm email change with tokens' })
  @ApiBody({ type: ChangeEmailDto })
  changeEmail(@Body() body: ChangeEmailDto, @Req() req: Request) {
    return this.userService.changeEmail(body, req);
  }

  @Put('change-password')
  @ApiOperation({ summary: 'Change user password' })
  @ApiBody({ type: ChangePasswordDto })
  changeUserPassword(@Body() body: ChangePasswordDto, @Req() req: Request) {
    return this.userService.changeUserPassword(body, req);
  }

  @Delete('delete-user')
  @ApiOperation({ summary: 'Delete current logged-in user and related data' })
  DeleteCurrentLoginUser(@Req() req: Request) {
    return this.userService.deleteUser(req);
  }
}
