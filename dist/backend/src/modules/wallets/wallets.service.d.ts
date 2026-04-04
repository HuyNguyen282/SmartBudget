import { Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { InitializeWalletDto } from './dto/initialize-wallet.dto';
export declare class WalletService {
    private walletRepository;
    constructor(walletRepository: Repository<Wallet>);
    initializeWallet(userId: number, dto: InitializeWalletDto): Promise<{
        message: string;
        wallet: Wallet;
    }>;
}
