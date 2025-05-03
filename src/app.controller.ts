import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

class CreateDishDto {
  name: string;
  price: number;
  type: string;
}

@ApiTags('dishes')
@Controller('dish')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new dish' })
  @ApiResponse({ status: 201, description: 'Returns the ID of the created dish' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createDish(@Body() data: CreateDishDto) {
    return this.appService.createDish(data);
  }

  
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a dish by ID' })
  @ApiResponse({ status: 200, description: 'Returns success or fail' })
  async deleteDish(@Param('id') id: string) {
    return this.appService.deleteDish(parseInt(id));
  }

  @Get()
  @ApiOperation({ summary: 'Get all dishes' })
  @ApiResponse({ status: 200, description: 'Returns an array of dishes' })
  async getAllDishes() {
    return this.appService.getAllDishes();
  }
}
