import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateNoteDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  body?: string;
}
