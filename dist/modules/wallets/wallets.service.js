"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const wallet_entity_1 = require("./entities/wallet.entity");
const transaction_entity_1 = require("../transactions/entities/transaction.entity");
let WalletService = class WalletService {
    walletRepository;
    dataSource;
    constructor(walletRepository, dataSource) {
        this.walletRepository = walletRepository;
        this.dataSource = dataSource;
    }
    async initializeWallet(userId, dto) {
        const { name, balance, type, categories } = dto;
        if (balance === undefined || balance < 0) {
            throw new common_1.BadRequestException('Số tiền khởi tạo không hợp lệ hoặc bị bỏ trống');
        }
        const existingWallet = await this.walletRepository.findOne({
            where: { userId: userId }
        });
        if (existingWallet) {
            throw new common_1.BadRequestException('Tài khoản này đã được khởi tạo trước đó');
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const wallet = queryRunner.manager.create(wallet_entity_1.Wallet, {
                name: name,
                balance: balance,
                type: type,
                categories: categories || [],
                userId: userId,
            });
            await queryRunner.manager.save(wallet);
            if (balance > 0) {
                const initialTransaction = queryRunner.manager.create(transaction_entity_1.Transaction, {
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
        }
        catch (error) {
            console.log('LỖI DATABASE LÀ:', error);
            await queryRunner.rollbackTransaction();
            throw new common_1.InternalServerErrorException({
                message: 'Lỗi thực sự của Database:',
                detail: error.message,
            });
        }
        finally {
            await queryRunner.release();
        }
    }
};
exports.WalletService = WalletService;
exports.WalletService = WalletService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(wallet_entity_1.Wallet)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource])
], WalletService);
//# sourceMappingURL=wallets.service.js.map