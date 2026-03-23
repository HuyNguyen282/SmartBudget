"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseConfig = void 0;
const databaseConfig = (configService) => {
    console.log(configService.get('DB_USER'));
    console.log(configService.get('DB_NAME'));
    return {
        type: 'mariadb',
        host: configService.get('DB_HOST'),
        port: parseInt(configService.get('DB_PORT') || '3306', 10),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASS'),
        database: configService.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
    };
};
exports.databaseConfig = databaseConfig;
//# sourceMappingURL=database.config.js.map