import { Module } from '@nestjs/common';
import { NoteService } from './note.service';
import { NoteController } from './note.controller';
import { Utils } from 'src/utils/UtilsClass';

@Module({
  controllers: [NoteController],
  providers: [NoteService, Utils],
})
export class NoteModule {}
