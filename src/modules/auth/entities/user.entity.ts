// entities/user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, unique: true })
  email?: string;

  @Column({ nullable: true, unique: true })
  phoneNumber?: string;

  @Column({ name: 'password_hash' })
  password: string; // hashed

  @Column({ default: 'user' })
  role: string; // e.g., 'admin', 'user'

  @CreateDateColumn({ name: 'created' })
  createdAt: Date;
  @Column({ nullable: true, default: null })
  username: string;

  @Column({ type: 'varchar', nullable: true })
  resetPasswordToken: string | null;

  @Column({ type: 'timestamp', nullable: true })
  resetPasswordExpires: Date | null;
}