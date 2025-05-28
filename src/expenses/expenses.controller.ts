import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { FilterExpenseDto } from './dto/filter-expense.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('expenses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova despesa' })
  @ApiResponse({ status: 201, description: 'Despesa criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(@Body() createExpenseDto: CreateExpenseDto) {
    return this.expensesService.create(createExpenseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as despesas com filtros opcionais' })
  @ApiResponse({ status: 200, description: 'Lista de despesas' })
  findAll(@Query() filterDto: FilterExpenseDto) {
    return this.expensesService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma despesa pelo ID' })
  @ApiResponse({ status: 200, description: 'Despesa encontrada' })
  @ApiResponse({ status: 404, description: 'Despesa não encontrada' })
  findOne(@Param('id') id: string) {
    return this.expensesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma despesa' })
  @ApiResponse({ status: 200, description: 'Despesa atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Despesa não encontrada' })
  update(@Param('id') id: string, @Body() updateExpenseDto: UpdateExpenseDto) {
    return this.expensesService.update(id, updateExpenseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir uma despesa' })
  @ApiResponse({ status: 200, description: 'Despesa excluída com sucesso' })
  @ApiResponse({ status: 404, description: 'Despesa não encontrada' })
  remove(@Param('id') id: string) {
    return this.expensesService.remove(id);
  }
}
