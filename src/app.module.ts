import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { PokemonModule } from './pokemon/pokemon.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { ConfigModule, ConfigService } from '@nestjs/config/';
import { EnvConfiguration } from './config/app.config';
import { joiValidationSchema } from './config/joi.validation';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [EnvConfiguration,],
      validationSchema:joiValidationSchema
     }), //este va hasta arriba
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    // MongooseModule.forRoot('mongodb://localhost:27017/nest-pokemon'),
    MongooseModule.forRoot(process.env.MONGODB!,{
      dbName:'dbPokemon'
    }),
    PokemonModule,
    CommonModule,
    SeedModule,
    
  ],
  controllers: [],
  providers: [],
})
export class AppModule {  }
