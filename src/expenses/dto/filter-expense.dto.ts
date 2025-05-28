import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumberString } from 'class-validator';

export class FilterExpenseDto {
  @ApiPropertyOptional({ example: '05', description: 'Mês para filtrar' })
  @IsOptional()
  @IsNumberString()
  month?: string;

  @ApiPropertyOptional({ example: '2025', description: 'Ano para filtrar' })
  @IsOptional()
  @IsNumberString()
  year?: string;

  @ApiPropertyOptional({
    example: 'Alimentação',
    description: 'Categoria para filtrar',
  })
  @IsOptional()
  @IsString()
  category?: string;
}
