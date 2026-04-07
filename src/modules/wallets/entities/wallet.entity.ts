import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Transaction } from '../../transactions/entities/transaction.entity';

@Entity('wallets')
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column()
  name: string;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  balance: number;

  @Column()
  type: string;

  @Column('simple-array')
  categories: string[];
}