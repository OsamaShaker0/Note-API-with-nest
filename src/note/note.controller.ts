import {
  Controller,
  Get,
  Param,
  UseGuards,
  Req,
  Body,
  Post,
  Put,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { NoteService } from './note.service';
import { AuthenticationGuard } from 'src/guards/guards.guard';
import { CreateNoteDto } from './dto/CreateNote.dto';
import { UpdateNoteDto } from './dto/UpdateNote.dto';
@UseGuards(AuthenticationGuard) // 👈 protect all routes
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller('notes')
export class NoteController {
  constructor(private noteService: NoteService) {}
  @UseGuards(AuthenticationGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @Get()
  getAllNotes(@Req() req: Request) {
    return this.noteService.getAllNotes(req);
  }

  @Get(':id')
  getSingleNote(@Param() param, @Req() req: Request) {
    return this.noteService.getNote(param, req);
  }

  @Post()
  createNote(@Body() body: CreateNoteDto, @Req() req: Request) {
    return this.noteService.createNote(body, req);
  }

  @Put('update-note/:id')
  updateNote(@Param() param, @Body() body: UpdateNoteDto, @Req() req: Request) {
    return this.noteService.updateNote(param, body, req);
  }

  @Delete('delete-note/:id')
  deleteNote(@Param() param, @Req() req: Request) {
    return this.noteService.deleteNote(param, req);
  }
}
