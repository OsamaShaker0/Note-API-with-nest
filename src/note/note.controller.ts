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
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Notes')
@ApiBearerAuth('access-token') // 👈 match the name from main.ts
@UseGuards(AuthenticationGuard)
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller('notes')
export class NoteController {
  constructor(private noteService: NoteService) {}
  @Get()
  @ApiOperation({ summary: 'Get all notes for the authenticated user' })
  getAllNotes(@Req() req: Request) {
    return this.noteService.getAllNotes(req);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single note by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Note ID' })
  getSingleNote(@Param() param, @Req() req: Request) {
    return this.noteService.getNote(param, req);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new note' })
  @ApiBody({ type: CreateNoteDto })
  createNote(@Body() body: CreateNoteDto, @Req() req: Request) {
    return this.noteService.createNote(body, req);
  }

  @Put('update-note/:id')
  @ApiOperation({ summary: 'Update an existing note' })
  @ApiParam({ name: 'id', type: String, description: 'Note ID' })
  @ApiBody({ type: UpdateNoteDto })
  updateNote(@Param() param, @Body() body: UpdateNoteDto, @Req() req: Request) {
    return this.noteService.updateNote(param, body, req);
  }

  @Delete('delete-note/:id')
  @ApiOperation({ summary: 'Delete a note by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Note Id' })
  deleteNote(@Param() param, @Req() req: Request) {
    return this.noteService.deleteNote(param, req);
  }
}
