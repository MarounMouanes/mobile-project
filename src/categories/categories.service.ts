import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Category } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<any[]> {
    // Get all categories with their habits
    const categories = await this.prisma.category.findMany({
      include: {
        habits: true,
      },
    });
    
    // Transform the response to include habit count
    return categories.map(category => ({
      id: category.id,
      name: category.name,
      description: category.description || "Description Unavailable",
      color: category.color,
      habitCount: category.habits.length,
      // Don't include the full habits array in the response to keep it light
      // habits: category.habits
    }));
  }

  async findOne(id: number): Promise<any | null> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        habits: true,
      },
    });
    
    if (!category) return null;
    
    return {
      id: category.id,
      name: category.name,
      description: category.description || "Description Unavailable",
      color: category.color,
      habitCount: category.habits.length,
      habits: category.habits
    };
  }

  async create(data: { name: string; color?: string; description?: string }): Promise<Category> {
    // Set default description if not provided
    if (!data.description) {
      data.description = "Description Unavailable";
    }
    
    return this.prisma.category.create({
      data,
    });
  }

  async update(id: number, data: { name?: string; color?: string; description?: string }): Promise<Category> {
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