import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletService } from './wallets.service';
import { WalletsController } from './wallets.controller';
import {Wallet} from './entities/wallet.entity'
@Module({
  imports: [TypeOrmModule.forFeature([Wallet])],
  controllers: [WalletsController],
  providers: [WalletService],
})
export class WalletsModule {}
