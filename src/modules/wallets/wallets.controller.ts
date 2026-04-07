import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { WalletService } from './wallets.service';
import { InitializeWalletDto } from './dto/initialize-wallet.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; 
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('wallets')
@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('initialize')
  async initializeBalance(
    @Request() req, 
    @Body() dto: InitializeWalletDto
  ) {
    const userId = req.user.userId;
    return this.walletsService.initializeWallet(userId, dto);
  }
}