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
    .addBearerAuth() 
    .build();

    const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); 
  const configService = app.get(ConfigService);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
