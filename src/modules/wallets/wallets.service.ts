import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { InitializeWalletDto } from './dto/initialize-wallet.dto';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
  ) {}

  async initializeWallet(userId: number, dto: InitializeWalletDto) {
    const { name, balance } = dto;

    if (balance < 0) {
      throw new BadRequestException(
        'Số tiền không hợp lệ',
      );
    }

    const existingWallet = await this.walletRepository.findOne({
      where: { userId: userId }
    });
    
    if (existingWallet) {
      throw new BadRequestException('Tài khoản này đã được khởi tạo trước đó');
    }

    try {
      const wallet = this.walletRepository.create({
        name: name,
        balance: balance,
        userId: userId,
        status: 'active', 
      });

      await this.walletRepository.save(wallet);

      return {
        message: 'Khởi tạo số dư thành công',
        wallet,
      };
    } catch (error) {
      throw new Error(
        'Không thể lưu dữ liệu. Vui lòng kiểm tra kết nối và thử lại',
      );
    }
  }
}