import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v2') // pone un prefijo global para la url de la app o api NEST

  // validaciones globales de los dto y decoradores de clases
  app.useGlobalPipes( 
    new ValidationPipe({ 
    whitelist: true, 
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions:{
      enableImplicitConversion: true,
    }
    }) 
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
