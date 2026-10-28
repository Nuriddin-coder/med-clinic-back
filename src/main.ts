import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. CORS sozlamalari (barcha domenlar, localhost va Swagger uchun)
  app.enableCors({
    origin: true,
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: '*',
    exposedHeaders: '*',
  });

  // 2. Global prefiks: /v1
  app.setGlobalPrefix('v1', {
    exclude: ['api/docs', 'api/docs/(.*)'],
  });

  // 3. Global validatsiya
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // 4. Standart xatolik formati va CORS kafolati uchun global filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // 5. Swagger sozlamalari
  const config = new DocumentBuilder()
    .setTitle('MED Clinic API')
    .setDescription('MED Clinic — Onlayn tibbiy xizmatlar va qabulga yozilish tizimi REST API hujjatlari')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT ?? 5000;
  await app.listen(port);

  const logger = new Logger('Bootstrap');
  logger.log(`Server is running on: http://localhost:${port}/v1`);
  logger.log(`Swagger documentation: http://localhost:${port}/api/docs`);
}
bootstrap();
