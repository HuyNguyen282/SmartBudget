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
    const { balance } = dto;

    if (balance < 0) {
      throw new BadRequestException(
        'Số tiền không hợp lệ (phải là số dương)',
      );
    }

    
    try {
      const wallet = this.walletRepository.create({
        balance,
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