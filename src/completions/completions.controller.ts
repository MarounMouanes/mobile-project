import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { CompletionsService } from './completions.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';

class CreateCompletionDto {
  habitId: number;
  date?: Date;
}

@ApiTags('completions')
@Controller('completions')
@UseGuards(AuthGuard)
export class CompletionsController {
  constructor(private readonly completionsService: CompletionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all completions or filter by habit' })
  @ApiResponse({ status: 200, description: 'Returns all completions or filtered by habit' })
  async findAll(@Query('habitId') habitId: string, @Request() req) {
    if (habitId) {
      return this.completionsService.findByHabit(parseInt(habitId), req.user.id);
    }
    return this.completionsService.findAll(req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new completion' })
  @ApiResponse({ status: 201, description: 'Completion created successfully' })
  async create(@Body() createCompletionDto: CreateCompletionDto, @Request() req) {
    return this.completionsService.create(createCompletionDto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a completion' })
  @ApiResponse({ status: 200, description: 'Completion deleted successfully' })
  async remove(@Param('id') id: string, @Request() req) {
    return this.completionsService.remove(+id, req.user.id);
  }
}