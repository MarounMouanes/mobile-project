import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Completion } from '@prisma/client';

@Injectable()
export class CompletionsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: number): Promise<Completion[]> {
    return this.prisma.completion.findMany({
      where: {
        habit: {
          userId: userId
        }
      },
      include: {
        habit: true
      }
    });
  }

  async findByHabit(habitId: number, userId: number): Promise<Completion[]> {
    // First check if the habit belongs to the user
    const habit = await this.prisma.habit.findFirst({
      where: {
        id: habitId,
        userId: userId
      }
    });

    if (!habit) {
      throw new ForbiddenException('You do not have access to this habit');
    }

    return this.prisma.completion.findMany({
      where: {
        habitId: habitId
      }
    });
  }

  async create(createCompletionDto: any, userId: number): Promise<Completion> {
    // Check if the habit belongs to the user
    const habit = await this.prisma.habit.findFirst({
      where: {
        id: createCompletionDto.habitId,
        userId: userId
      }
    });

    if (!habit) {
      throw new ForbiddenException('You do not have access to this habit');
    }

    // Set default date to today if not provided
    if (!createCompletionDto.date) {
      createCompletionDto.date = new Date();
    }

    return this.prisma.completion.create({
      data: createCompletionDto
    });
  }

  async remove(id: number, userId: number): Promise<Completion> {
    // Check if the completion belongs to a habit owned by the user
    const completion = await this.prisma.completion.findFirst({
      where: {
        id: id,
        habit: {
          userId: userId
        }
      },
      include: {
        habit: true
      }
    });

    if (!completion) {
      throw new NotFoundException(`Completion with ID ${id} not found or you don't have access`);
    }

    return this.prisma.completion.delete({
      where: {
        id: id
      }
    });
  }
}