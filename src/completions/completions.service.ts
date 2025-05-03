import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Completion } from '@prisma/client';

@Injectable()
export class CompletionsService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Completion[]> {
    return this.prisma.completion.findMany();
  }

  async findByHabit(habitId: number): Promise<Completion[]> {
    return this.prisma.completion.findMany({
      where: { habitId },
    });
  }

  async create(data: { habitId: number; date?: Date }): Promise<Completion> {
    return this.prisma.completion.create({
      data,
    });
  }

  async delete(id: number): Promise<Completion> {
    return this.prisma.completion.delete({
      where: { id },
    });
  }
}