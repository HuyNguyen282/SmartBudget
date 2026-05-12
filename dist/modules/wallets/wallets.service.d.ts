import { Repository, DataSource } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { InitializeWalletDto } from './dto/initialize-wallet.dto';
export declare class WalletService {
    private walletRepository;
    private dataSource;
    constructor(walletRepository: Repository<Wallet>, dataSource: DataSource);
    initializeWallet(userId: number, dto: InitializeWalletDto): Promise<{
        message: string;
        wallet: Wallet;
    }>;
}
