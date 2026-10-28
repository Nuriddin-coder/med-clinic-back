import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Frontend bilan muammosiz ishlashi uchun CORS'ni yoqish
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Med Clinic API')
    .setDescription('Loyihadagi barcha API lar uchun qollanma')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const httpAdapter = app.getHttpAdapter();
  httpAdapter.get('/', (req, res) => {
    res.redirect('/api/docs');
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  Logger.log(`🚀 Dastur ishga tushdi: http://localhost:${port}`);
  Logger.log(`📚 Swagger UI manzili: http://localhost:${port}/api/docs`);
}
bootstrap();