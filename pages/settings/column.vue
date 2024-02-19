<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>Column Settings</h2>
        Clicked Order equals your Column Order
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card title="Hypixel Colums (Always Shown)">
          <v-card-text class="mt-4">
            <v-select placeholder="None" variant="outlined" color="secondary" :items="Object.values(Constants.overlay.supportedColumns.hypixel)" prepend-icon="mdi-table-search" multiple chips v-model="hypixelColumns" return-object @update:modelValue="setHypixelColumns"></v-select>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card title="Minigame Gamemode">
          <v-card-text class="mt-4">
            <v-select label="Bedwars" placeholder="None" variant="outlined" color="secondary" :items="Object.values(Constants.overlay.supportedColumns.bedwars)" prepend-icon="mdi-bed" multiple chips v-model="bedwarsColumns" return-object @update:modelValue="setBedwarsColumns"></v-select>
            <v-select label="Skywars" placeholder="None" variant="outlined" color="secondary" :items="Object.values(Constants.overlay.supportedColumns.skywars)" prepend-icon="mdi-weather-cloudy" multiple chips v-model="skywarsColumns" return-object @update:modelValue="setSkywarsColumns"></v-select>
            <v-select label="Duels" placeholder="None" variant="outlined" color="secondary" :items="Object.values(Constants.overlay.supportedColumns.duels)" prepend-icon="mdi-fencing" multiple chips v-model="duelsColumns" return-object @update:modelValue="setDuelsColumns"></v-select>
            <v-select label="Murder Mystery" placeholder="None" variant="outlined" color="secondary" :items="Object.values(Constants.overlay.supportedColumns.murderMystery)" prepend-icon="mdi-coffin" multiple chips v-model="murderMysteryColumns" return-object @update:modelValue="setMurderMysteryColumns"></v-select>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import dataStore from "../../electron/store";

const convertToReadable = (arr: string[], constant: any) => {
  const converted: string[] = [];
  arr.forEach((stat) => {
    // @ts-ignore
    converted.push(constant[stat]);
  });
  return converted;
};

const convertToID = (arr: string[], constant: any) => {
  const converted: string[] = [];
  arr.forEach((stat) => {
    // @ts-ignore
    converted.push(constant[stat]);
  });
  return converted;
};

const hypixelColumns = ref(convertToReadable(dataStore.get("columnSettings").columns, Constants.overlay.supportedColumns.hypixel));
const setHypixelColumns = () => {
  dataStore.set("columnSettings.columns", convertToID(hypixelColumns.value, reverseObject(Constants.overlay.supportedColumns.hypixel)));
};
const bedwarsColumns = ref(convertToReadable(dataStore.get("columnSettings").bedwarsSettings.columns, Constants.overlay.supportedColumns.bedwars));
const setBedwarsColumns = () => {
  dataStore.set("columnSettings.bedwarsSettings.columns", convertToID(bedwarsColumns.value, reverseObject(Constants.overlay.supportedColumns.bedwars)));
};
const skywarsColumns = ref(convertToReadable(dataStore.get("columnSettings").skywarsSettings.columns, Constants.overlay.supportedColumns.skywars));
const setSkywarsColumns = () => {
  dataStore.set("columnSettings.skywarsSettings.columns", convertToID(skywarsColumns.value, reverseObject(Constants.overlay.supportedColumns.skywars)));
};
const duelsColumns = ref(convertToReadable(dataStore.get("columnSettings").duelsSettings.columns, Constants.overlay.supportedColumns.duels));
const setDuelsColumns = () => {
  dataStore.set("columnSettings.duelsSettings.columns", convertToID(duelsColumns.value, reverseObject(Constants.overlay.supportedColumns.duels)));
};
const murderMysteryColumns = ref(convertToReadable(dataStore.get("columnSettings").murderMysterySettings.columns, Constants.overlay.supportedColumns.murderMystery));
const setMurderMysteryColumns = () => {
  dataStore.set("columnSettings.murderMysterySettings.columns", convertToID(murderMysteryColumns.value, reverseObject(Constants.overlay.supportedColumns.murderMystery)));
};
</script>
