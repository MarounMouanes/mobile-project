import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Habit } from '@prisma/client';

@Injectable()
export class HabitsService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Habit[]> {
    return this.prisma.habit.findMany({
      include: {
        category: true,
        completions: true,
      },
    });
  }

  async findOne(id: number): Promise<Habit | null> {
    return this.prisma.habit.findUnique({
      where: { id },
      include: {
        category: true,
        completions: true,
      },
    });
  }

  async findByUser(userId: number): Promise<Habit[]> {
    return this.prisma.habit.findMany({
      where: { userId },
      include: {
        category: true,
        completions: true,
      },
    });
  }

  async create(data: {
    title: string;
    description?: string;
    frequency: string;
    userId: number;
    categoryId: number;
  }): Promise<Habit> {
    return this.prisma.habit.create({
      data,
      include: {
        category: true,
      },
    });
  }

  async update(
    id: number,
    data: {
      title?: string;
      description?: string;
      frequency?: string;
      categoryId?: number;
    },
  ): Promise<Habit> {
    return this.prisma.habit.update({
      where: { id },
      data,
      include: {
        category: true,
        completions: true,
      },
    });
  }

  async delete(id: number): Promise<Habit> {
    return this.prisma.habit.delete({
      where: { id },
    });
  }
}