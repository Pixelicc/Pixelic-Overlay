<template>
  <div>
    <v-select class="mt-2" label="Hypixel Gamemode" variant="outlined" color="secondary" :items="Object.values(Constants.overlay.supportedModes.hypixel)" v-model="hypixelMode" return-object @update:modelValue="setHypixelMode"></v-select>
    <v-select class="mt-2" label="Minigame Gamemode" variant="outlined" color="secondary" :items="minigameModes" v-model="minigameMode" return-object @update:modelValue="setMinigameMode"></v-select>
  </div>
</template>

<script setup lang="ts">
import dataStore from "../electron/store";

const hypixelMode = ref(Constants.overlay.supportedModes.hypixel[dataStore.get("hypixelSettings").mode]);
const setHypixelMode = () => {
  dataStore.set("hypixelSettings.mode", reverseObject(Constants.overlay.supportedModes.hypixel)[hypixelMode.value]);
  GamemodeManager.hypixelMode.value = reverseObject(Constants.overlay.supportedModes.hypixel)[hypixelMode.value];
  getMinigameModes();
};

const minigameModes: Ref<string[]> = ref([]);
const minigameMode = ref("");
const getMinigameModes = () => {
  if (dataStore.get("hypixelSettings").mode === "BEDWARS") {
    minigameMode.value = Constants.overlay.supportedModes.bedwars[dataStore.get("hypixelSettings").bedwarsSettings.mode];
    minigameModes.value = Object.values(Constants.overlay.supportedModes.bedwars);
  }
  if (dataStore.get("hypixelSettings").mode === "SKYWARS") {
    minigameMode.value = Constants.overlay.supportedModes.skywars[dataStore.get("hypixelSettings").skywarsSettings.mode];
    minigameModes.value = Object.values(Constants.overlay.supportedModes.skywars);
  }
  if (dataStore.get("hypixelSettings").mode === "DUELS") {
    minigameMode.value = Constants.overlay.supportedModes.duels[dataStore.get("hypixelSettings").duelsSettings.mode];
    minigameModes.value = Object.values(Constants.overlay.supportedModes.duels);
  }
  if (dataStore.get("hypixelSettings").mode === "MURDER_MYSTERY") {
    minigameMode.value = Constants.overlay.supportedModes.murderMystery[dataStore.get("hypixelSettings").murderMysterySettings.mode];
    minigameModes.value = Object.values(Constants.overlay.supportedModes.murderMystery);
  }
};
getMinigameModes();
const setMinigameMode = () => {
  if (GamemodeManager.hypixelMode.value === "BEDWARS") {
    dataStore.set("hypixelSettings.bedwarsSettings.mode", reverseObject(Constants.overlay.supportedModes.bedwars)[minigameMode.value]);
    GamemodeManager.bedwarsMode.value = reverseObject(Constants.overlay.supportedModes.bedwars)[minigameMode.value];
  }
  if (GamemodeManager.hypixelMode.value === "SKYWARS") {
    dataStore.set("hypixelSettings.skywarsSettings.mode", reverseObject(Constants.overlay.supportedModes.skywars)[minigameMode.value]);
    GamemodeManager.skywarsMode.value = reverseObject(Constants.overlay.supportedModes.skywars)[minigameMode.value];
  }
  if (GamemodeManager.hypixelMode.value === "DUELS") {
    dataStore.set("hypixelSettings.duelsSettings.mode", reverseObject(Constants.overlay.supportedModes.duels)[minigameMode.value]);
    GamemodeManager.duelsMode.value = reverseObject(Constants.overlay.supportedModes.duels)[minigameMode.value];
  }
  if (GamemodeManager.hypixelMode.value === "MURDER_MYSTERY") {
    dataStore.set("hypixelSettings.murderMysterySettings.mode", reverseObject(Constants.overlay.supportedModes.murderMystery)[minigameMode.value]);
    GamemodeManager.murderMysteryMode.value = reverseObject(Constants.overlay.supportedModes.murderMystery)[minigameMode.value];
  }
};
</script>
