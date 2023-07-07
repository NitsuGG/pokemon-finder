<script setup lang="ts">
import Axios from 'axios';
import Pokemon from './models/Pokemon';
import Type from './models/Type';
import Generation from './models/Generation';
import Color from './models/Color';
import Cards from './components/Cards.vue';
import { onMounted, ref } from 'vue';

// get a random pokemon
const getRandomPokemon = async () => {
  var randomId = Math.floor(Math.random() * 1008) + 1;
  var pokemon = await Axios.get(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
  var pokemonSpecies = await Axios.get(`https://pokeapi.co/api/v2/pokemon-species/${randomId}`);

  // Get pokemon types
  var pokemonTypes =  new Array();
  pokemon.data.types.forEach((type: any) => {
    Axios.get(type.type.url).then((response: any) => {
      let translation = new Map <string, string>();
      response.data.names.forEach((name: any) => {
        translation.set(name.language.name, name.name);
      });
      let newType = new Type(response.data.id, response.data.name, translation);
      pokemonTypes.push(newType);
    });
  });

  // get Pokemon color(s)
  var pokemonColors = await Axios.get(pokemonSpecies.data.color.url).then((response: any) => {
    let translation = new Map <string, string>();
    response.data.names.forEach((name: any) => {
      translation.set(name.language.name, name.name);
    });
    let colors = new Color(response.data.id, response.data.name, translation);
    return colors;
  });

  // get Pokemon generation
  var pokemonGeneration = await Axios.get(pokemonSpecies.data.generation.url).then((response: any) => {
    let translation = new Map <string, string>();
    response.data.names.forEach((name: any) => {
      translation.set(name.language.name, name.name);
    });
    let generation = new Generation(response.data.id, response.data.name, translation);
    return generation;
  });

  // get Pokemon name translation
  var translation = new Map <string, string>();
  pokemonSpecies.data.names.forEach((name: any) => {
    translation.set(name.language.name, name.name);
  });

  // get Pokemon img
  var pokemonImg = pokemon.data.sprites.other.home.front_default != null ? pokemon.data.sprites.other.home.front_default : pokemon.data.sprites.front_default;
  var pokemonObj = new Pokemon(pokemon.data.id, pokemon.data.name, pokemonTypes, pokemonColors, pokemonSpecies.data.is_legendary, pokemonSpecies.data.is_mythical, pokemonGeneration, pokemonImg, translation);

  return pokemonObj;
};
let myPokemon = ref<Pokemon>()
onMounted(async () => {
   myPokemon.value = await getRandomPokemon();
});
</script>

<template>
  <div>
    <h1 class="title"> {{ $t("Who's that pokemon ?") }}</h1>
    <Cards v-if="myPokemon" :pokemon="myPokemon" />
  </div>
</template>

<style scoped>
</style>
