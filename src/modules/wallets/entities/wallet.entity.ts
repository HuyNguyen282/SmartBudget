import { Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

@Entity('wallets')
export class Wallet {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ default: 0 })
  balance: number;
  

  @Column({ default: 'inactive' })
  status: string;

}