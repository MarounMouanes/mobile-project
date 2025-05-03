import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Category } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Category[]> {
    return this.prisma.category.findMany();
  }

  async findOne(id: number): Promise<Category | null> {
    return this.prisma.category.findUnique({
      where: { id },
      include: {
        habits: true,
      },
    });
  }

  async create(data: { name: string; color?: string }): Promise<Category> {
    return this.prisma.category.create({
      data,
    });
  }

  async update(id: number, data: { name?: string; color?: string }): Promise<Category> {
    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Category> {
    return this.prisma.category.delete({
      where: { id },
    });
  }
}