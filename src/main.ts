import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('coir-management/api');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.enableCors({
    origin: 'http://localhost:5173', // your React/Vite frontend
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
