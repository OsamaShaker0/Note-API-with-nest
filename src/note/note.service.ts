/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

import { GetNoteDto } from './dto/GetNote.dto';
import { CreateNoteDto } from './dto/CreateNote.dto';
import { UpdateNoteDto } from './dto/UpdateNote.dto';

@Injectable()
export class NoteService {
  constructor(private prisma: PrismaService) {}
  async getAllNotes(req) {
    const notes = await this.prisma.note.findMany({
      where: { userId: req.user.id },
    });
    if (!notes.length) {
      throw new NotFoundException('You Do not create any notes yet');
    }
    return notes;
  }
  async getNote(param: GetNoteDto, req) {
    const id = param.id;

    const note = await this.prisma.note.findFirst({
      where: { id, userId: req.user.id },
    });
    if (!note) {
      throw new NotFoundException(
        'there no note with this id or it not belong to current login user ',
      );
    }
    return note;
  }
  async createNote(body: CreateNoteDto, req) {
    if (body.body === undefined || body.title === undefined) {
      throw new BadRequestException('Missing values');
    }

    try {
      return await this.prisma.note.create({
        data: {
          title: body.title,
          body: body.body,
          userId: req.user.id,
        },
      });
    } catch (error) {
      console.error('CreateNote error:', error);
      throw new InternalServerErrorException('Could not create note');
    }
  }
  async updateNote(param, body: UpdateNoteDto, req) {
    if (body.body === undefined && body.title === undefined) {
      throw new BadRequestException('You must provide one value at least');
    }
    const note = await this.prisma.note.findFirst({
      where: { id: param.id, userId: req.user.id },
    });
    if (!note) {
      throw new NotFoundException(
        'there no note with this id or it not belong to current login user ',
      );
    }

    try {
      return await this.prisma.note.update({
        where: { id: param.id },
        data: {
          ...(body.title && { title: body.title }),
          ...(body.body && { body: body.body }),
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Could not update note');
    }
  }
  async deleteNote(param, req) {
    const note = await this.prisma.note.findFirst({
      where: { id: param.id, userId: req.user.id },
    });

    if (!note) {
      throw new NotFoundException('Note not found or not owned by this user');
    }

    await this.prisma.note.delete({
      where: { id: param.id },
    });

    return { msg: 'Note deleted successfully' };
  }
}
