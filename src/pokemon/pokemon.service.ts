import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './schemas/pokemon.schema';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {

  constructor(

    // Inyectar modelo
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>

  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();

    try {

      // Insertar datos en mongo
      const pokemon = await this.pokemonModel.create( createPokemonDto );
      return pokemon;

    } catch (error) {
      
      if ( error.code === 11000 ) {
        throw new BadRequestException( `Pokemon exists in db: ${ JSON.stringify( error.errmsg ) }` );
      }

      console.log(error);

      throw new InternalServerErrorException( `Can't create Pokemon - Check server logs` );

    }
    
    
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(query: string) {
    
    let pokemon: Pokemon;

    // Verifica que sea un numero
    if ( !isNaN(+query) ) {
      pokemon = await this.pokemonModel.findOne({ no: query });
    }

    // Verifica que sea un MongoID
    if ( !pokemon && isValidObjectId( query ) ) {
      pokemon = await this.pokemonModel.findById( query );
    }

    // Name
    if ( !pokemon ) {
      pokemon = await this.pokemonModel.findOne({ name: query.toLowerCase().trim() });
    }


    if ( !pokemon ) 
      throw new NotFoundException( `Pokemon with id, name or no "${ query }" not found` );

    return pokemon;

  }

  update(id: number, updatePokemonDto: UpdatePokemonDto) {
    return `This action updates a #${id} pokemon`;
  }

  remove(id: number) {
    return `This action removes a #${id} pokemon`;
  }


}
