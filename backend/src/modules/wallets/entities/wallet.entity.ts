import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('wallets')
export class Wallet {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: 0 })
    balance: number;

    @Column({ default: 'inactive' })
    status: string;

}