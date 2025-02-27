import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
// import { PokemonService } from 'src/pokemon/pokemon.service';// exportar el servicio


@Injectable()
export class SeedService {

  private readonly axios = axios

  constructor(
    // private readonly pokemonService:PokemonService // inyectamos el servicio 
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>, // injeccion del modelo 
  ){}


  async executeSeed() {

    await this.pokemonModel.deleteMany(); // = delete * from pokemons;

    const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');
    // const insertPromisesArray: any[]= []; // insertar por varias promesas
    const pokemonInsert : {name:string, no:number}[] = []

    data.results.forEach( async ({ name,url }) =>{
      const segments = url.split('/');
      const no = +segments[segments.length - 2];
      // await this.pokemonService.create({name,no}) //  debe ser exportado en pokemon.module e importado en seed todo el pokemon.module 
      // const pokemon = await this.pokemonModel.create({name,no}) // insertar uno a uno
      //this.pokemonModel.create({name,no}) devuelve una promise 
      
      //todo insercion por varias promesas 1a1
      // insertPromisesArray.push(
      //   this.pokemonModel.create({ name,no })
      // );
      // console.log({ name,no})

      pokemonInsert.push({name,no}) // crea un arreglo de todos los pokemones 

    });
    await this.pokemonModel.insertMany(pokemonInsert); // hace una sola consulta y envia toda la lista a insertar
    return 'Seed executed successfully';
    // return `This action execute seed`;
  }

}
