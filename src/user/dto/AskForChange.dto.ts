import { IsEmail, IsNotEmpty } from 'class-validator';

export class AskForChangeDto {
  @IsNotEmpty()
  @IsEmail()
  newEmail: string;
}
