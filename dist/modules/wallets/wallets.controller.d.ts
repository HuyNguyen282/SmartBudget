import { WalletService } from './wallets.service';
import { InitializeWalletDto } from './dto/initialize-wallet.dto';
export declare class WalletsController {
    private readonly walletsService;
    constructor(walletsService: WalletService);
    initializeBalance(req: any, dto: InitializeWalletDto): Promise<{
        message: string;
        wallet: import("./entities/wallet.entity").Wallet;
    }>;
}
