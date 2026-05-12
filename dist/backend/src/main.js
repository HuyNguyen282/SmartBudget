"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = new swagger_1.DocumentBuilder()
        .setTitle('SmartBudget API')
        .setDescription('Tài liệu API cho hệ thống Smart Spending Management')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    app.enableCors({
        origin: [
            "http://localhost:3000",
            "http://localhost:3001"
        ],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    });
    swagger_1.SwaggerModule.setup('api', app, document);
    const configService = app.get(config_1.ConfigService);
    await app.listen(5000);
}
bootstrap();
//# sourceMappingURL=main.js.map