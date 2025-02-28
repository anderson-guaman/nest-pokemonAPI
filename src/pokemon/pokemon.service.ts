import { isValidObjectId, Model } from 'mongoose';
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { isEmpty, isNotEmpty } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class PokemonService {

   constructor(
      // para inyectar un model en nest y mongoose
      @InjectModel(Pokemon.name)
      private readonly pokemonModel: Model<Pokemon>
   ) { }


   async create(createPokemonDto: CreatePokemonDto) {
      createPokemonDto.name = createPokemonDto.name.toLowerCase();
      try {
         const pokemon = await this.pokemonModel.create(createPokemonDto)
         return pokemon;
      } catch (error) {
         if (error.code === 11000)
            throw new InternalServerErrorException(`Pokemon exists in db ${JSON.stringify(error.keyValue)} `);
         console.log(error);
         throw new InternalServerErrorException(`Can't save pokemon - Check server logs`)
      }


   }


   async findAll( paginationDto : PaginationDto) {
      // limit limita la cantidad de registros, 
      // offset se salta esa cantidad de registros y trae los siguiente n registros de acuerdo al limite
      const { limit = 10, offset = 0 } = paginationDto;
      return await this.pokemonModel.find()
      .limit( limit )
      .skip ( offset )
      .sort({ no : 1}) // ordena por no 1= acendente
      .select('-__v') // selecciona - = a q no entregue esa opcion '__v'
      ;
   }



   async findOne( term: string ) {
      let pokemon : Pokemon | null = null;

      // find with no
      if ( !isNaN(+term)) {
         pokemon = await this.pokemonModel.findOne({ no: term });
      }
      // find with id
      if( isValidObjectId(term) ){
         pokemon = await this.pokemonModel.findOne({ _id:term })
      }
      // find with name of pokemon
      if( isEmpty(pokemon) ){
         pokemon = await this.pokemonModel.findOne({ name:term })
      }
      if ( isEmpty(pokemon) ){
         throw new NotFoundException(`Pokemon not found with term \"${term}\"`)
      }
      return pokemon;
   }


   async update(term: string, updatePokemonDto: UpdatePokemonDto) {
      const pokemon = await this.findOne( term );
      if ( updatePokemonDto.name )
         updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
      try {
         await pokemon?.updateOne( updatePokemonDto );
         return {...pokemon?.toJSON(),...updatePokemonDto};
      } catch (error) {
         if (error.code === 11000)
            throw new BadRequestException(`Pokemon exists in db ${JSON.stringify(error.keyValue)} `);
         console.log(error);
         throw new InternalServerErrorException(`Can't save pokemon - Check server logs`)
      } 
   }

   async remove(id: string) {
      // const result = this.pokemonModel.findByIdAndDelete(id);
      // return `This action removes a #${id} pokemon`;
      const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });
      if( deletedCount ===0 )
         throw new BadRequestException(`Pokemon with id "${id}" not found`);
      return `Pokemon with id: ${id} delete`;
   }

}
