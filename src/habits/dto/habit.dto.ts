import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsInt } from 'class-validator';

export class CreateHabitDto {
  @ApiProperty({ description: 'The title of the habit' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'The description of the habit', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'The goal of the habit', required: false })
  @IsOptional()
  @IsString()
  goal?: string;

  @ApiProperty({ description: 'The frequency of the habit', required: false, default: 'daily' })
  @IsOptional()
  @IsString()
  frequency?: string;

  @ApiProperty({ description: 'The category ID for the habit', required: false })
  @IsOptional()
  @IsInt()
  categoryId?: number;
}

export class UpdateHabitDto {
  @ApiProperty({ description: 'The title of the habit', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: 'The description of the habit', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'The goal of the habit', required: false })
  @IsOptional()
  @IsString()
  goal?: string;

  @ApiProperty({ description: 'The frequency of the habit', required: false })
  @IsOptional()
  @IsString()
  frequency?: string;

  @ApiProperty({ description: 'The category ID for the habit', required: false })
  @IsOptional()
  @IsInt()
  categoryId?: number;
} 