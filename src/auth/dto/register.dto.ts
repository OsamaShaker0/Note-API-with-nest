import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisetrDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
}
