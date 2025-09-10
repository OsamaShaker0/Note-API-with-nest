import { IsNotEmpty } from 'class-validator';

export class GetNoteDto {
  @IsNotEmpty()
  id: string;
}
