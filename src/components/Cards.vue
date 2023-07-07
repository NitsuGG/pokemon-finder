<script setup lang="ts">
import { ref, reactive } from 'vue';
import Pokemon from '../models/Pokemon';
import { onMounted, watch  } from 'vue';

const props = defineProps<{ pokemon: Pokemon }>()
// get the pokemon given in props
const pokemon = ref(props.pokemon).value;
console.log(pokemon);
var nbTry = ref(0);
var Autocomplete = reactive(new Array<string>() );
var AutocompleteValue = "";
function verification() {
  let userAnswer = AutocompleteValue.toLowerCase();
  let translationsResult = false;
  // let tipsDiv = document.getElementById("tips") as HTMLDivElement;
  let divBlur = document.getElementsByClassName("hidden-blur")[0] as HTMLImageElement;
  pokemon.translations.forEach((value) => {
    if(value.toLowerCase() === userAnswer) {
      translationsResult = true;
    }
  })
  // if user answer is === to pokemon name or is included in pokemon names array
  if(userAnswer === pokemon.name.toLowerCase() || translationsResult) {
    alert("Good answer !")
  }
  else {
    nbTry.value++;
    switch(nbTry.value) {       
      case 5:
        divBlur.style.filter="contrast(1) brightness(1)"
        break;
        case 6:
          alert("You lost ! The pokemon was " + pokemon.name + ".")
          break;
    }
  }
}
async function importLocalizedFile(): Promise<any> {
  const language = navigator.language;
  const filePath = `../locales/pokemon/${language}.json`;

  try {
    const { default: locale } = await import(filePath);
    return locale;
  } catch (error) {
    console.error(`Failed to import localized file for language: ${language}`, error);
    // Gérer l'erreur de chargement du fichier
    return null;
  }
}

onMounted(async () => {
  Autocomplete.value = await importLocalizedFile().then((locale) => {
    return locale;
  })
})

</script>

<template>
      <v-card
    class="mx-auto"
    max-width="344"
  >
    <v-img :src="pokemon.imageUrl"
      height="200"
      contain
      class="hidden-blur"
    ></v-img>
    <v-divider></v-divider>

    <v-card-title>
      {{ $t("Who's that pokemon ?") }}
    </v-card-title>

    <v-chip-group id="tips">

      <v-chip v-if="nbTry >= 1" class="ma-1" color="green" variant="outlined" v-for="type in pokemon.types" >
        {{ type.translations.has($i18n.locale)? type.translations.get($i18n.locale) : type.name }}
      </v-chip>
      <v-chip v-if="nbTry >= 2" class="ma-1" color="green" variant="outlined">
        {{ pokemon.generation.translations.has($i18n.locale)? pokemon.generation.translations.get($i18n.locale) : pokemon.generation.name }}
      </v-chip>
      <v-chip v-if="nbTry >= 2 && pokemon.legendary" class="ma-1" color="green" variant="outlined">
        {{ $t("Legendary") }}
      </v-chip>
      <v-chip v-if="nbTry >= 2 && pokemon.mythical" class="ma-1" color="green" variant="outlined">
        {{ $t("Mythical") }}
      </v-chip>
      <v-chip v-if="nbTry >= 3" class="ma-1" color="green" variant="outlined">
        {{ pokemon.color.translations.has($i18n.locale)? pokemon.color.translations.get($i18n.locale) : pokemon.color.name }}
      </v-chip>
      

    </v-chip-group>

    <v-expand-transition>
      <div>
        <v-divider></v-divider>

        <v-card-text>
          <v-autocomplete id="input-pokemon" v-if="Autocomplete" label="Autocomplete" :items="Autocomplete.value" v-model="AutocompleteValue"></v-autocomplete>
          <v-btn @click="verification" >{{ $t("Send") }}</v-btn>
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<style scoped>

.hidden-blur {
  filter: contrast(100%) brightness(0);
  transition: filter 0.5s ease-in-out;
  pointer-events: none;
}
</style>