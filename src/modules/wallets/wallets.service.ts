import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { Transaction } from '../transactions/entities/transaction.entity';
import { InitializeWalletDto } from './dto/initialize-wallet.dto';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    private dataSource: DataSource
  ) {}

  async initializeWallet(userId: number, dto: InitializeWalletDto) {
    const { name, balance, type, categories } = dto;

    if (balance === undefined || balance < 0) {
      throw new BadRequestException('Số tiền khởi tạo không hợp lệ hoặc bị bỏ trống');
    }

    const existingWallet = await this.walletRepository.findOne({
      where: { userId: userId }
    });
    
    if (existingWallet) {
      throw new BadRequestException('Tài khoản này đã được khởi tạo trước đó');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const wallet = queryRunner.manager.create(Wallet, {
        name: name,
        balance: balance,
        type: type,
        categories: categories || [],
        userId: userId,
      });

      await queryRunner.manager.save(wallet);

      if (balance > 0) {
        const initialTransaction = queryRunner.manager.create(Transaction, {
          amount: balance,
          walletId: wallet.id, 
          userId: userId,
          transactionDate: new Date().toISOString().split('T')[0],
          note: 'Khởi tạo số dư ban đầu',
          type: 'income', 
          categoryId: 0, 
        });
        await queryRunner.manager.save(initialTransaction);
      }

      await queryRunner.commitTransaction();
      return {
        message: 'Khởi tạo số dư thành công',
        wallet,
      };
    } catch (error) {
      console.log('LỖI DATABASE LÀ:', error);
      await queryRunner.rollbackTransaction();
      
      throw new InternalServerErrorException({
        message: 'Lỗi thực sự của Database:',
        detail: error.message,
    });
  } finally {
      await queryRunner.release();
    }
  }
}