import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokemonRes } from './interface/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';


@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios;
  
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel:Model<Pokemon>){}

  async seedDb() {
    
    
    const { data } = await this.axios.get<PokemonRes>(
      'https://pokeapi.co/api/v2/pokemon?limit=10',
    );
    
    const arregloResults:{name:string,no:number}[] =[]

    data.results.forEach(({name,url})=>{//puedo destructurar porque ya se que propiedades vienen 
      //extraccion del id:
      const segment = url.split('/')
      const no = +segment[segment.length-2]
      
      console.log({name,no})
      
      // const newPokemonFromApi = await this.pokemonModel.create({name,no})

      arregloResults.push(({name,no}))       
    })

    this.pokemonModel.insertMany(arregloResults)

    return 'seed executed'; 
  }
}
