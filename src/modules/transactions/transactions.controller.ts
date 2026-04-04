import { Controller, Post, Body, UseGuards, Request, Patch, Delete } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Param } from '@nestjs/common';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard) 
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Thêm mới giao dịch chi tiêu' })
  async create(
    @Request() req, 
    @Body() createTransactionDto: CreateTransactionDto
  ) {
    const userId = req.user.userId;
    return this.transactionsService.createTransaction(userId, createTransactionDto);
  }
  
  @Patch(':id') 
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sửa giao dịch chi tiêu' })
  async update(
    @Request() req,
    @Param('id') id: string, 
    @Body() updateTransactionDto: UpdateTransactionDto
  ) {
    const userId = req.user.userId;
    return this.transactionsService.updateTransaction(userId, +id, updateTransactionDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard) 
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa giao dịch chi tiêu' })
  async remove(
    @Request() req,
    @Param('id') id: string
  ) {
    const userId = req.user.userId;
    return this.transactionsService.deleteTransaction(userId, +id);
  }
}