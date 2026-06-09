// ─────────────────────────────────────────────────────────────────────────────
// main.ts — NestJS Application Entry Point
// ─────────────────────────────────────────────────────────────────────────────

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'verbose'],
  });

  // CORS — allow frontend origin
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Worklyft API')
    .setDescription('Real-Time Revenue Operations Dashboard API')
    .setVersion('1.0')
    .addTag('users', 'User management')
    .addTag('dashboard', 'Dashboard aggregation')
    .addTag('leads', 'Lead management')
    .addTag('orders', 'Order management')
    .addTag('activities', 'Activity management')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);

  console.log(`🚀 Worklyft Backend is running on: http://localhost:${port}`);
  console.log(`📚 Swagger docs available at:      http://localhost:${port}/api/docs`);
  console.log(`🔌 WebSocket server ready`);
}

bootstrap();
