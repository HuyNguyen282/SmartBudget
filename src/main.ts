import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('SmartBudget API')
    .setDescription('Tài liệu API cho hệ thống Smart Spending Management')
    .setVersion('1.0')
    .addBearerAuth() // Thêm nút gắn Token JWT để test API bảo mật
    .build();

    const document = SwaggerModule.createDocument(app, config);
  // 'api' ở đây là đường dẫn để bạn truy cập (ví dụ: localhost:3000/api)
  SwaggerModule.setup('api', app, document); 
  // --- KẾT THÚC SETUP SWAGGER ---
  const configService = app.get(ConfigService);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
