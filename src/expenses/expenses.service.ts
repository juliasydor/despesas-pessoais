import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { FilterExpenseDto } from './dto/filter-expense.dto';
import { Decimal } from '@prisma/client/runtime/library';

type ExpenseWithAmount = {
  id: string;
  title: string;
  amount: Decimal;
  category: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
};

type WhereInput = {
  category?: string;
  date?: {
    gte: Date;
    lte: Date;
  };
};

type UpdateData = {
  title?: string;
  amount?: Decimal;
  category?: string;
  date?: Date;
};

type PrismaExpenseClient = {
  create: (args: {
    data: Omit<ExpenseWithAmount, 'id' | 'createdAt' | 'updatedAt'>;
  }) => Promise<ExpenseWithAmount>;
  findMany: (args: {
    where: any;
    orderBy: any;
  }) => Promise<ExpenseWithAmount[]>;
  findUnique: (args: {
    where: { id: string };
  }) => Promise<ExpenseWithAmount | null>;
  update: (args: {
    where: { id: string };
    data: Partial<Omit<ExpenseWithAmount, 'id' | 'createdAt' | 'updatedAt'>>;
  }) => Promise<ExpenseWithAmount>;
  delete: (args: { where: { id: string } }) => Promise<ExpenseWithAmount>;
};

@Injectable()
export class ExpensesService {
  private prisma: { expense: PrismaExpenseClient };

  constructor(prismaService: PrismaService) {
    this.prisma = prismaService as unknown as { expense: PrismaExpenseClient };
  }

  async create(createExpenseDto: CreateExpenseDto): Promise<ExpenseWithAmount> {
    const result = await this.prisma.expense.create({
      data: {
        title: createExpenseDto.title,
        amount: new Decimal(createExpenseDto.amount),
        category: createExpenseDto.category,
        date: new Date(createExpenseDto.date),
      },
    });
    return result;
  }

  async findAll(filterDto: FilterExpenseDto): Promise<ExpenseWithAmount[]> {
    const where: WhereInput = {};

    if (filterDto.category) {
      where.category = filterDto.category;
    }

    if (filterDto.month && filterDto.year) {
      const startDate = new Date(
        parseInt(filterDto.year),
        parseInt(filterDto.month) - 1,
        1,
      );
      const endDate = new Date(
        parseInt(filterDto.year),
        parseInt(filterDto.month),
        0,
        23,
        59,
        59,
      );

      where.date = {
        gte: startDate,
        lte: endDate,
      };
    } else if (filterDto.year) {
      const startDate = new Date(parseInt(filterDto.year), 0, 1);
      const endDate = new Date(parseInt(filterDto.year), 11, 31, 23, 59, 59);

      where.date = {
        gte: startDate,
        lte: endDate,
      };
    }

    const expenses = await this.prisma.expense.findMany({
      where,
      orderBy: { date: 'desc' },
    });

    return expenses.map((expense) => ({
      ...expense,
      amount: new Decimal(expense.amount.toNumber()),
    }));
  }

  async findOne(id: string) {
    const expense = await this.prisma.expense.findUnique({
      where: { id },
    });

    if (!expense) {
      throw new NotFoundException(`Despesa com ID ${id} não encontrada`);
    }

    return {
      ...expense,
      amount: expense.amount.toNumber(),
    };
  }

  async update(id: string, updateExpenseDto: UpdateExpenseDto) {
    const expense = await this.prisma.expense.findUnique({
      where: { id },
    });

    if (!expense) {
      throw new NotFoundException(`Despesa com ID ${id} não encontrada`);
    }

    const data: UpdateData = {};

    if (updateExpenseDto.title !== undefined) {
      data.title = updateExpenseDto.title;
    }

    if (updateExpenseDto.amount !== undefined) {
      data.amount = new Decimal(updateExpenseDto.amount);
    }

    if (updateExpenseDto.category !== undefined) {
      data.category = updateExpenseDto.category;
    }

    if (updateExpenseDto.date !== undefined) {
      data.date = new Date(updateExpenseDto.date);
    }

    const updatedExpense = await this.prisma.expense.update({
      where: { id },
      data,
    });

    return {
      ...updatedExpense,
      amount: updatedExpense.amount.toNumber(),
    };
  }

  async remove(id: string) {
    const expense = await this.prisma.expense.findUnique({
      where: { id },
    });

    if (!expense) {
      throw new NotFoundException(`Despesa com ID ${id} não encontrada`);
    }

    await this.prisma.expense.delete({
      where: { id },
    });

    return { message: 'Despesa excluída com sucesso' };
  }
}
