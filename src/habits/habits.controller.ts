import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { HabitsService } from './habits.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

class CreateHabitDto {
  title: string;
  description?: string;
  frequency: string;
  userId: number;
  categoryId: number;
}

class UpdateHabitDto {
  title?: string;
  description?: string;
  frequency?: string;
  categoryId?: number;
}

@ApiTags('habits')
@Controller('habits')
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all habits or filter by user' })
  @ApiResponse({ status: 200, description: 'Returns all habits or filtered by user' })
  async findAll(@Query('userId') userId?: string) {
    if (userId) {
      return this.habitsService.findByUser(parseInt(userId));
    }
    return this.habitsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a habit by ID' })
  @ApiResponse({ status: 200, description: 'Returns a habit by ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.habitsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new habit' })
  @ApiResponse({ status: 201, description: 'Habit created successfully' })
  async create(@Body() createHabitDto: CreateHabitDto) {
    return this.habitsService.create(createHabitDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a habit' })
  @ApiResponse({ status: 200, description: 'Habit updated successfully' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateHabitDto: UpdateHabitDto,
  ) {
    return this.habitsService.update(id, updateHabitDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a habit' })
  @ApiResponse({ status: 200, description: 'Habit deleted successfully' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.habitsService.delete(id);
  }
}