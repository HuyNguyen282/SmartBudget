import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";



export const databaseConfig = (configService: ConfigService): TypeOrmModuleOptions => {
    console.log(configService.get<string>('DB_USER'));
    console.log(configService.get<string>('DB_NAME'));
  return {
    type: 'mariadb', // works with MariaDB
    host: configService.get<string>('DB_HOST'),
    port: parseInt(configService.get<string>('DB_PORT')|| '3306', 10),
    username: configService.get<string>('DB_USER'),
    password: configService.get<string>('DB_PASS'),
    database: configService.get<string>('DB_NAME'),
    autoLoadEntities: true,
    synchronize: true, // only for dev
  };
};
