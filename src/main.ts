import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Solo deja enviar la data que se esta esperando
      forbidNonWhitelisted: true, // Validar que solo lleguen las propiedades esperadas
    })
  )

  app.setGlobalPrefix('api/v2');
  
  await app.listen(3000);
}
bootstrap();
