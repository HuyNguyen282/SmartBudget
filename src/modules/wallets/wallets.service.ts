import { Injectable, BadRequestException } from '@nestjs/common';
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
<<<<<<< HEAD
    const { balance } = dto;

    if (balance < 0) {
      throw new BadRequestException(
        'Số tiền không hợp lệ (phải là số dương)',
      );
=======
    const { name, balance, type, categories} = dto;

    if (balance < 0) {
      throw new BadRequestException('Số tiền không hợp lệ');
>>>>>>> cb8888e7 (update)
    }

    
<<<<<<< HEAD
    try {
      const wallet = this.walletRepository.create({
        balance,
        status: 'active', 
        
=======
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
        categories: categories,
        userId: userId,
>>>>>>> cb8888e7 (update)
      });

      await queryRunner.manager.save(wallet);

      if (balance > 0) {
        const initialTransaction = queryRunner.manager.create(Transaction, {
          amount: balance,
          budgetId: wallet.id, 
          userId: userId,
          transactionDate: new Date().toISOString().split('T')[0],
          note: 'Khởi tạo số dư ban đầu',
          type: 'income', // Là khoản tiền được cộng vào
          categoryId: 0, // Danh mục mặc định
        });
        await queryRunner.manager.save(initialTransaction);
      }

      // Lưu thành công cả Ví và Giao dịch vào Database
      await queryRunner.commitTransaction();
      return {
        message: 'Khởi tạo số dư thành công',
        wallet,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error('Không thể lưu dữ liệu. Vui lòng kiểm tra kết nối và thử lại');
    } finally {
      await queryRunner.release();
    }
  }
}