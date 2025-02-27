import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { Pokemon, PokemonSchema } from './entities/pokemon.entity';

@Module({
  controllers: [PokemonController],
  providers: [PokemonService],
  imports: [
    
    MongooseModule.forFeature([
      // este es es si definicion de la coleccion dentro de mogo 
      {
        name: Pokemon.name, // este name no es la propiedad si no el nombre del extends document en la clase
        schema: PokemonSchema, // la entidad como tal 
      },
      // todos los esquemas o modelos de coleccion que se tenga en adelante 
    ])
  ]
})
export class PokemonModule {}
