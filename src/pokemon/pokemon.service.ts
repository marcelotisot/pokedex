import { 
  BadRequestException, 
  Injectable, 
  InternalServerErrorException, 
  NotFoundException 
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './schemas/pokemon.schema';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';


@Injectable()
export class PokemonService {

  // Paginacion
  private defaultLimit: number;

  constructor(

    // Inyectar modelo
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>,

    private readonly configService: ConfigService,

  ) {
    this.defaultLimit = this.configService.get<number>('defaultLimit');
  }

  async create(createPokemonDto: CreatePokemonDto) {

    createPokemonDto.name = createPokemonDto.name.toLowerCase();

    try {

      // Insertar datos en mongo
      const pokemon = await this.pokemonModel.create( createPokemonDto );
      return pokemon;

    } catch (error) { 

      this.handleExceptions( error );

    }
    
  }

  findAll( paginationDto: PaginationDto ) {

    const { limit = this.defaultLimit, offset = 0 } = paginationDto;

    return this.pokemonModel.find()
      .limit( limit )
      .skip( offset )
      .sort({
        no: 1 // 1: Ordena de manera ascendente
      })
      .select('-__v'); // Remover de la respuesta la columna __v

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

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    
    const pokemon = await this.findOne( term );

    if ( updatePokemonDto.name )
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();

    try {

      // Actualizar pokemon
      await pokemon.updateOne( updatePokemonDto );

      // Sobreescribe el pokemon con las propiedades de updatePokemonDto
      return { ...pokemon.toJSON(), ...updatePokemonDto };

    } catch (error) {

      this.handleExceptions( error );
      
    }

  }

  async remove(id: string) {

    // const pokemon = await this.findOne( id );
    // await pokemon.deleteOne();
    //return { id };
    // const result = await this.pokemonModel.findByIdAndDelete( id );


    // Validar ID y eliminar en una sola consulta
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });

    if ( deletedCount === 0 )
      throw new BadRequestException( `Pokemon with id "${ id }" not found` );

    return; // Retorna 200 OK

  }

  private handleExceptions( error: any ) {
    if ( error.code === 11000 ) {
      throw new BadRequestException( `Pokemon exists in db: ${ JSON.stringify( error.errmsg ) }` );
    }
    console.log(error);
    throw new InternalServerErrorException( `Can't create/update Pokemon - Check server logs` );
  }


}
