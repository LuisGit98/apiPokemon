import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,

    private readonly configService: ConfigService,
  ) {
    //formas de llamar varibles del .env:
    console.log(process.env.DEFAULT_LIMIT) //directamente. da undefined
    console.log(configService.get('defaultLimit'))//atraves del configService. si da el valor 
  }

  async create(createPokemonDto: CreatePokemonDto) {
    try {
      const poke = await this.pokemonModel.create(createPokemonDto);
      return poke;
    } catch (error) {
      this.handleExeptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 0, offset = 0 } = paginationDto;

    let pokemons = await this.pokemonModel.find().limit(limit).skip(offset);

    return pokemons;
  }

  async findOne(term: string) {
    // le puse term refiriendome a que es un termino de busuqeda
    //esta funcion implementa diferentes bsuquedas
    let pokemon: Pokemon | null = null; // esto lo arregle asi verificar despues si esta bien hacer eso

    //por numero(no)
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term });
    }
    //por mongoId
    if (isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase() });
    }

    if (!pokemon) {
      throw new NotFoundException('no se encontro el pokemon');
    }

    return pokemon;
  }

  async update(id: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(id);
    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    }

    try {
      await pokemon.updateOne(updatePokemonDto);

      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      this.handleExeptions(error);
    }
  }

  async remove(id: string) {
    // poner el id con guion bajo para mandar un solo id en el objeto que le paso adeleOne()
    // const po = await this.findOne(id);
    // await po.deleteOne();
    // return {id};
    await this.pokemonModel.deleteMany({});

    // const {deletedCount} = await this.pokemonModel.deleteOne({_id})//este. Tambien puede ser {_id:id} (si recibiera "id" en remove())
    // if(deletedCount===0){
    //   throw new BadRequestException(`Pokemon with id ${_id} not found`)
    // }
    //deleteOne() regresa informacion de lo que se elimino (deletedCount) entonces en base a eso yo  (si deletedCount viene en 0) puedo dar el error de que no se encontro ese id o retornar un 200 (si deletedCount = 1) De esa forma evito hacer dos consultas a la base de datos

    return;
  }

  private handleExeptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException('El dato ya existe');
    }
    console.log(error);

    throw new InternalServerErrorException(`Can't create pokemon`);
  }
}
