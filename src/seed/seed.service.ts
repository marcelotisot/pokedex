import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/schemas/pokemon.schema';
import { Model } from 'mongoose';

@Injectable()
export class SeedService {

  private readonly axios: AxiosInstance = axios;

  constructor(
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>
  ) {}

  async executeSeed() {

    // Eliminar todos los registros
    await this.pokemonModel.deleteMany({});

    const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');

    /*
    * Insertar multiples registros simultaneamente
    */
    const pokemonToInsert: { name: string, no: number }[] = [];

    data.results.forEach(({ name, url }) => {

      // Extraer los segmentos de la url
      const segments = url.split('/');

      // Extraer numero de pokemon
      const no: number = +segments[ segments.length - 2 ];

      // Insertar los datos
      pokemonToInsert.push({ name, no });

    });

    // Insertar todos los datos del arreglo pokemonToInsert en una sola insercion
    await this.pokemonModel.insertMany( pokemonToInsert );

    return 'Seed Executed';

  }

}
