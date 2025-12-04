import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Enable CORS for frontend
  const corsOrigin = configService.get<string>('app.cors.origin');
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
  });

  // Global API prefix
  app.setGlobalPrefix('api');

  const port = configService.get<number>('app.port') ?? 3000;
  await app.listen(port);

  const nodeEnv = configService.get<string>('app.nodeEnv');
  console.log(`🚀 Backend running on http://localhost:${port}/api [${nodeEnv}]`);
}
bootstrap();
