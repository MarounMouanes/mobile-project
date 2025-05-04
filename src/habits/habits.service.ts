import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Habit } from '@prisma/client';
import { CreateHabitDto, UpdateHabitDto } from './dto/habit.dto';

@Injectable()
export class HabitsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: number): Promise<Habit[]> {
    return this.prisma.habit.findMany({
      where: { userId },
      include: {
        category: true,
        completions: true,
      },
    });
  }

  async findOne(id: number, userId: number): Promise<Habit | null> {
    const habit = await this.prisma.habit.findUnique({
      where: { id, userId },
      include: {
        category: true,
        completions: true,
      },
    });

    if (!habit) {
      throw new NotFoundException(`Habit with ID ${id} not found for this user`);
    }

    return habit;
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

  async create(userId: number, createHabitDto: CreateHabitDto): Promise<Habit> {
    return this.prisma.habit.create({
      data: {
        title: createHabitDto.title,
        description: createHabitDto.description,
        goal: createHabitDto.goal,
        frequency: createHabitDto.frequency || 'daily',
        userId,
        categoryId: createHabitDto.categoryId,
      },
      include: {
        category: true,
      },
    });
  }

  async update(id: number, userId: number, updateHabitDto: UpdateHabitDto): Promise<Habit> {
    // First check if the habit exists and belongs to the user
    const habit = await this.prisma.habit.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!habit) {
      throw new NotFoundException(`Habit with ID ${id} not found or does not belong to user`);
    }

    return this.prisma.habit.update({
      where: { id },
      data: {
        title: updateHabitDto.title,
        description: updateHabitDto.description,
        goal: updateHabitDto.goal,
        frequency: updateHabitDto.frequency,
        categoryId: updateHabitDto.categoryId,
      },
      include: {
        category: true,
      },
    });
  }

  async delete(id: number, userId: number): Promise<Habit> {
    // First check if the habit exists and belongs to the user
    const habit = await this.prisma.habit.findUnique({
      where: { id, userId },
    });

    if (!habit) {
      throw new NotFoundException(`Habit with ID ${id} not found for this user`);
    }

    return this.prisma.habit.delete({
      where: { id },
    });
  }
}