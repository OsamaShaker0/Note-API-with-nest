import { IsNotEmpty, IsString } from 'class-validator';

export class ChangeEmailDto {
  @IsNotEmpty()
  @IsString()
  oldEmailToken;
  @IsNotEmpty()
  @IsString()
  newEmailToken;
}
