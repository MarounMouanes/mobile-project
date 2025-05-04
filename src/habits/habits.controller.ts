import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { HabitsService } from './habits.service';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

class CreateHabitDto {
  title: string;
  description?: string;
  frequency: string;
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
@UseGuards(AuthGuard)
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all habits for the authenticated user' })
  @ApiResponse({ status: 200, description: 'Returns all habits for the user' })
  async findAll(@Request() req) {
    return this.habitsService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a habit by ID for the authenticated user' })
  @ApiResponse({ status: 200, description: 'Returns a habit by ID' })
  async findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.habitsService.findOne(id, req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new habit for the authenticated user' })
  @ApiResponse({ status: 201, description: 'Habit created successfully' })
  async create(@Body() createHabitDto: CreateHabitDto, @Request() req) {
    return this.habitsService.create(req.user.id, createHabitDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a habit for the authenticated user' })
  @ApiResponse({ status: 200, description: 'Habit updated successfully' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateHabitDto: UpdateHabitDto,
    @Request() req
  ) {
    return this.habitsService.update(id, req.user.id, updateHabitDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a habit for the authenticated user' })
  @ApiResponse({ status: 200, description: 'Habit deleted successfully' })
  async delete(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.habitsService.delete(id, req.user.id);
  }
}