<script setup lang="ts">
import { ref, reactive } from 'vue';
import Pokemon from '../models/Pokemon';
import { onMounted  } from 'vue';
import { useI18n } from 'vue-i18n'

// translation init 
const { t } = useI18n()
const props = defineProps<{ pokemon: Pokemon }>()
// get the pokemon given in props
const pokemon = ref(props.pokemon).value;
var nbTry = ref(0);
var Autocomplete:any = reactive(new Array<string>() );
var AutocompleteValue = "";
var pokemonName = pokemon.translations.get(navigator.language) != undefined ? pokemon.translations.get(navigator.language) : pokemon.name;
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
    let etat = confirm("Good answer ! You found the pokemon "+ pokemonName +"in " + (nbTry.value+1) + " try !")
    if(etat) {
      window.location.reload();
    }

  }
  else {
    nbTry.value++;
    switch(nbTry.value) {       
      case 5:
        divBlur.style.filter="contrast(1) brightness(1)"
        break;
        case 6:
          // get the name of the pokemon in the current language
          var etat = confirm("You lost ! The pokemon was " + pokemonName + " ! Do you want to try again ?");
          if(etat) {
            window.location.reload();
          }
    }
    document.getElementById('cards')?.classList.add('wrong-answer');
    setTimeout(() => {
      document.getElementById('cards')?.classList.remove('wrong-answer');
    }, 1000);
  }
}

onMounted(async () => {
  Autocomplete.value = await importLocalizedFile().then((locale) => {
    return locale;
  })
})

async function importLocalizedFile(): Promise<any> {
  const language = navigator.language.split('-')[0];
  const filePath = `../locales/pokemon/${language}.json`;

  try {
    const response = await fetch(filePath);
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(`Failed to fetch localized file for language: ${language}`);
    }
  } catch (error) {
    console.error(error);
    const enFilePath = `../locales/pokemon/en.json`;
    const response = await fetch(enFilePath);
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(`Failed to fetch default localized file.`);
    }
  }
}
</script>

<template>
      <v-card id="cards"
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
      {{ t("messages.whos-pokemon") }}
    </v-card-title>

    <v-chip-group id="tips">

      <v-chip v-if="nbTry >= 1" class="ma-1" color="green" variant="outlined" v-for="type in pokemon.types" >
        {{ type.translations.has($i18n.locale)? type.translations.get($i18n.locale) : type.name }}
      </v-chip>
      <v-chip v-if="nbTry >= 2" class="ma-1" color="green" variant="outlined">
        {{ pokemon.generation.translations.has($i18n.locale)? pokemon.generation.translations.get($i18n.locale) : pokemon.generation.name }}
      </v-chip>
      <v-chip v-if="nbTry >= 2 && pokemon.legendary" class="ma-1" color="green" variant="outlined">
        {{ t("messages.Legendary") }}
      </v-chip>
      <v-chip v-if="nbTry >= 2 && pokemon.mythical" class="ma-1" color="green" variant="outlined">
        {{ t("messages.Mythical") }}
      </v-chip>
      <v-chip v-if="nbTry >= 3" class="ma-1" color="green" variant="outlined">
        {{ pokemon.color.translations.has($i18n.locale)? pokemon.color.translations.get($i18n.locale) : pokemon.color.name }}
      </v-chip>
      

    </v-chip-group>

    <v-expand-transition>
      <div>
        <v-divider></v-divider>

        <v-card-text>
          <v-autocomplete id="input-pokemon" v-if="Autocomplete" :label="t('messages.Pokemon name')" :items="Autocomplete.value" v-model="AutocompleteValue"></v-autocomplete>
          <v-btn @click="verification" >{{ t("messages.Send") }}</v-btn>
          <v-btn icon class="ml-2" onclick="window.location.reload()">
            <v-icon>mdi-reload</v-icon>
          </v-btn>
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

.wrong-answer{
  /* make the border of the card red, and shake the div */
  border: 1px solid red;
  animation: shake 0.5s;
}

@keyframes shake {
  0% { transform: translate(1px, 1px) rotate(0deg); }
  10% { transform: translate(-1px, -2px) rotate(-1deg); }
  20% { transform: translate(-3px, 0px) rotate(1deg); }
  30% { transform: translate(3px, 2px) rotate(0deg); }
  40% { transform: translate(1px, -1px) rotate(1deg); }
  50% { transform: translate(-1px, 2px) rotate(-1deg); }
  60% { transform: translate(-3px, 1px) rotate(0deg); }
  70% { transform: translate(3px, 1px) rotate(-1deg); }
  80% { transform: translate(-1px, -1px) rotate(1deg); }
  90% { transform: translate(1px, 2px) rotate(0deg); }
  100% { transform: translate(1px, -2px) rotate(-1deg); }
}



</style>