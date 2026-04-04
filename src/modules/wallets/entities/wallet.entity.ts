<<<<<<< HEAD
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
=======
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Transaction } from '../../transactions/entities/transaction.entity';
>>>>>>> cb8888e7 (update)

@Entity()
export class Wallet {
<<<<<<< HEAD

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: 0 })
    balance: number;

    @Column({ default: 'inactive' })
    status: string;
=======
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
>>>>>>> cb8888e7 (update)

  @Column('simple-array')
  categories: string[];
}