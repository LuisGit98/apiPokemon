import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v2')

  //que no se te olvide poner el pipe global para solo aceptar los datos cpn las reglas 
  app.useGlobalPipes(new ValidationPipe({
    whitelist:true,
    forbidNonWhitelisted:true,
    transform:true,//para que transforme los queryparams a a los que nececito (recibo string quiero number)
    transformOptions:{
      enableImplicitConversion:true,
    }
  }))


  await app.listen(process.env.PORT!);
}
bootstrap();
