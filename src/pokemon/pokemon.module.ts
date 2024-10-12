import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Pokemon, PokemonSchema } from './schemas/pokemon.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { 
        name: Pokemon.name, 
        schema: PokemonSchema 
      }
    ])
  ],

  controllers: [PokemonController],
  providers: [PokemonService],
})
export class PokemonModule {}
