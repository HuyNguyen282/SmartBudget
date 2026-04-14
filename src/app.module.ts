import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { WalletsModule } from './modules/wallets/wallets.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { TransactionsModule } from './modules/transactions/transactions.module';
// import { DashboardModule } from './dashboard/dashboard.module';
import { GoalModule } from './modules/goal/goal.module';
import { CategoryModule } from './modules/category/category.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mariadb', 
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 3306),
        username: config.get<string>('DB_USER', 'admin'),
        password: config.get<string>('DB_PASS', 'admin'),
        database: config.get<string>('DB_NAME', 'database'),
        autoLoadEntities: true,
        synchronize: true, 
      }),
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: config.get('MAIL_USER'),
            pass: config.get('MAIL_PASS'),
          },
        },
      }),
    }),
    AuthModule,
    WalletsModule,
    TransactionsModule,
    GoalModule,
    CategoryModule
  ],
})
export class AppModule {}



