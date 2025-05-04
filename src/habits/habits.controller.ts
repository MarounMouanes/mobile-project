import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
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

  @Post()
  @ApiOperation({ summary: 'Create a new habit' })
  @ApiResponse({ status: 201, description: 'The habit has been successfully created.' })
  create(@Request() req, @Body() createHabitDto: CreateHabitDto) {
    return this.habitsService.create(createHabitDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all habits for the authenticated user' })
  @ApiResponse({ status: 200, description: 'Return all habits for the user' })
  findAll(@Request() req) {
    return this.habitsService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a habit by ID' })
  @ApiResponse({ status: 200, description: 'Return the habit' })
  @ApiResponse({ status: 404, description: 'Habit not found' })
  findOne(@Request() req, @Param('id') id: string) {
    return this.habitsService.findOne(+id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a habit' })
  @ApiResponse({ status: 200, description: 'The habit has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Habit not found' })
  update(@Request() req, @Param('id') id: string, @Body() updateHabitDto: UpdateHabitDto) {
    return this.habitsService.update(+id, updateHabitDto, req.user.id);
  }

  @Patch(':id/checkin')
  @ApiOperation({ summary: 'Check in to a habit (update streak and progress)' })
  @ApiResponse({ status: 200, description: 'The habit has been successfully updated with new streak and progress.' })
  @ApiResponse({ status: 404, description: 'Habit not found' })
  checkin(@Request() req, @Param('id') id: string) {
    return this.habitsService.checkin(+id, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a habit' })
  @ApiResponse({ status: 200, description: 'The habit has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Habit not found' })
  remove(@Request() req, @Param('id') id: string) {
    return this.habitsService.remove(+id, req.user.id);
  }
}