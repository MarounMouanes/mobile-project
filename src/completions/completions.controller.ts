import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { CompletionsService } from './completions.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

class CreateCompletionDto {
  habitId: number;
  date?: Date;
}

@ApiTags('completions')
@Controller('completions')
export class CompletionsController {
  constructor(private readonly completionsService: CompletionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all completions or filter by habit' })
  @ApiResponse({ status: 200, description: 'Returns all completions or filtered by habit' })
  async findAll(@Query('habitId') habitId?: string) {
    if (habitId) {
      return this.completionsService.findByHabit(parseInt(habitId));
    }
    return this.completionsService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new completion' })
  @ApiResponse({ status: 201, description: 'Completion created successfully' })
  async create(@Body() createCompletionDto: CreateCompletionDto) {
    return this.completionsService.create(createCompletionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a completion' })
  @ApiResponse({ status: 200, description: 'Completion deleted successfully' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.completionsService.delete(id);
  }
}