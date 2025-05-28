import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsDateString,
  IsNotEmpty,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateExpenseDto {
  @ApiProperty({
    example: 'Almoço no restaurante',
    description: 'Título da despesa',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 45.5, description: 'Valor da despesa' })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  amount: number;

  @ApiProperty({ example: 'Alimentação', description: 'Categoria da despesa' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ example: '2025-05-27', description: 'Data da despesa' })
  @IsDateString()
  date: string;
}
