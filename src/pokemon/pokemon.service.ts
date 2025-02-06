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

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    try {
      const poke = await this.pokemonModel.create(createPokemonDto);
      return poke;
    } catch (error) {
      this.handleExeptions(error);
    }
  }

  async findAll() {
    let pokemons = await this.pokemonModel.find();

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

  async remove(_id: string) {  // poner el id con guion bajo para mandar un solo id en el objeto que le paso adeleOne()
    // const po = await this.findOne(id);
    // await po.deleteOne();
    // return {id};

    const {deletedCount} = await this.pokemonModel.deleteOne({_id})//este. Tambien puede ser {_id:id} (si recibiera "id" en remove())
    if(deletedCount===0){
      throw new BadRequestException(`Pokemon with id ${_id} not found`)
    }

    return  
  }

  private handleExeptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException('El dato ya existe');
    }
    console.log(error);

    throw new InternalServerErrorException(`Can't create pokemon`);
  }
}
