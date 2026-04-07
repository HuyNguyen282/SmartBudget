import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { Wallet } from '../wallets/entities/wallet.entity'; 

@Injectable()
export class TransactionsService {
  constructor(private dataSource: DataSource) {}

  async createTransaction(userId: number, dto: CreateTransactionDto) {

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const wallet = await queryRunner.manager.findOne(Wallet, {
        where: { userId: userId},
      });

      if (!wallet) {
        throw new NotFoundException('Không tìm thấy dữ liệu ngân sách. Vui lòng khởi tạo số dư trước khi thêm giao dịch.');
      }

      // 2. Tạo giao dịch mới
      const newTransaction = queryRunner.manager.create(Transaction, {
        amount: dto.amount,
        categoryId: dto.categoryId,
        transactionDate: dto.transactionDate,
        note: dto.note,
        userId: userId, 
        walletId: wallet.id, 
        type: 'expense', // Mặc định đây là khoản chi tiêu
      });
      
      await queryRunner.manager.save(newTransaction);

      // 3. Cập nhật số dư 
      wallet.balance = Number(wallet.balance) - Number(dto.amount);
      await queryRunner.manager.save(wallet);

      await queryRunner.commitTransaction();

      return {
        message: 'Thêm giao dịch thành công',
        transaction: newTransaction,
      };

    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Lỗi khi thêm giao dịch:', error);
      throw new InternalServerErrorException('Lỗi hệ thống. Không thể lưu giao dịch.');
    } finally {
      await queryRunner.release();
    }
  }

  async updateTransaction(userId: number, transactionId: number, dto: UpdateTransactionDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Tìm giao dịch cũ trong database
      const oldTransaction = await queryRunner.manager.findOne(Transaction, {
        where: { id: transactionId },
      });

      if (!oldTransaction) {
        throw new NotFoundException('Không tìm thấy giao dịch cần sửa');
      }

      const wallet = await queryRunner.manager.findOne(Wallet, {
        where: { id: oldTransaction.walletId },
      });

      if (!wallet) {
        throw new NotFoundException('Không tìm thấy dữ liệu ngân sách');
      }

      if (dto.amount !== oldTransaction.amount) {
        // Hoàn lại tiền cũ vào ví, sau đó trừ đi tiền mới
        wallet.balance = Number(wallet.balance) + Number(oldTransaction.amount) - Number(dto.amount);
        await queryRunner.manager.save(wallet);
      }

      // 4. Cập nhật thông tin giao dịch 
      queryRunner.manager.merge(Transaction, oldTransaction, dto);
      await queryRunner.manager.save(oldTransaction);

      await queryRunner.commitTransaction();

      return {
        message: 'Cập nhật thành công',
        transaction: oldTransaction,
      };

    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Lỗi khi sửa giao dịch:', error);
      
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Lỗi hệ thống');
    } finally {
      await queryRunner.release();
    }
  }

  async deleteTransaction(userId: number, transactionId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      //Truy xuất số tiền của giao dịch 
      const transaction = await queryRunner.manager.findOne(Transaction, {
        where: { id: transactionId, userId: userId },
      });

      if (!transaction) {
        throw new NotFoundException('Không tìm thấy giao dịch cần xóa');
      }

      const wallet = await queryRunner.manager.findOne(Wallet, {
        where: { id: transaction.walletId, userId: userId },
      });

      if (!wallet) {
        throw new NotFoundException('Không tìm thấy dữ liệu ngân sách');
      }

      wallet.balance = Number(wallet.balance) + Number(transaction.amount);
      await queryRunner.manager.save(wallet);

      await queryRunner.manager.remove(transaction);

      await queryRunner.commitTransaction();

      return {
        message: 'Xóa giao dịch thành công',
      };

    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Lỗi khi xóa giao dịch:', error);
      
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Lỗi hệ thống');
    } finally {
      await queryRunner.release();
    }
  }
}