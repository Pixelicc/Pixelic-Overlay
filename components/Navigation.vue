<template>
  <v-toolbar density="compact" style="-webkit-app-region: drag; background-color: rgba(var(--v-theme-background), calc(var(--opacity) + 0.3)) !important">
    <v-app-bar-nav-icon variant="text" @click.stop="sidebar = !sidebar" style="-webkit-app-region: no-drag"></v-app-bar-nav-icon>
    <v-toolbar-title v-if="!sidebar" class="grow">Pixelic Overlay</v-toolbar-title>
    <v-toolbar-title v-if="sidebar" class="grow" style="-webkit-app-region: no-drag">Pixelic Overlay</v-toolbar-title>
    <v-btn v-if="useRoute().path === '/'" icon @click="PlayerManager.refreshPlayers" style="-webkit-app-region: no-drag">
      <v-icon color="primary">mdi-refresh</v-icon>
    </v-btn>
    <v-btn v-if="useRoute().path === '/'" icon @click="PlayerManager.clearPlayers" style="-webkit-app-region: no-drag">
      <v-icon color="primary">mdi-account-multiple-minus</v-icon>
    </v-btn>
    <v-menu v-if="useRoute().path === '/'" v-model="quickSettings" :close-on-content-click="false" location="end">
      <template v-slot:activator="{ props }">
        <v-btn icon class="mr-4" v-bind="props" style="-webkit-app-region: no-drag">
          <v-icon color="primary">mdi-tune-vertical</v-icon>
        </v-btn>
      </template>
      <v-card min-width="300">
        <v-list>
          <v-list-item>
            <v-select class="mt-2" label="Hypixel Gamemode" variant="outlined" color="primary" :items="Object.values(Constants.overlay.supportedModes.hypixel)" v-model="hypixelMode" return-object @update:modelValue="setHypixelMode"></v-select>
            <v-select class="mt-2" label="Minigame Gamemode" variant="outlined" color="primary" :items="minigameModes" v-model="minigameMode" return-object @update:modelValue="setMinigameMode"></v-select>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
    <v-text-field v-if="useRoute().path === '/'" variant="outlined" color="primary" density="compact" single-line hide-details prepend-inner-icon="mdi-account-search" persistent-placeholder placeholder="Search player(s)" v-model="playerSearchQuery" @keydown.enter.prevent="addPlayerFromQuery" :rules="[validateQuery]" style="-webkit-app-region: no-drag; max-width: 25%"></v-text-field>
    <v-text-field v-if="useRoute().path === '/statistics'" variant="outlined" color="primary" density="compact" single-line hide-details prepend-inner-icon="mdi-account-search" persistent-placeholder placeholder="Search player(s)" v-model="playerStatisticsSearchQuery" @keydown.enter.prevent="openStatsticsFromQuery" :rules="[validateQuery]" style="-webkit-app-region: no-drag; max-width: 25%"></v-text-field>
    <v-btn icon @click="minimizeWindow" style="-webkit-app-region: no-drag">
      <v-icon>mdi-minus</v-icon>
    </v-btn>
    <v-btn icon @click="closeWindow" style="-webkit-app-region: no-drag">
      <v-icon>mdi-window-close</v-icon>
    </v-btn>
  </v-toolbar>
  <v-navigation-drawer temporary v-model="sidebar">
    <v-list nav color="secondary">
      <v-list-item prepend-icon="mdi-table" title="Overlay" value="overlay" nuxt-link to="/"></v-list-item>
      <v-list-item prepend-icon="mdi-chart-line" title="Statistics" value="statistics" nuxt-link to="/statistics"></v-list-item>
      <v-divider :thickness="8" class="border-opacity-0"></v-divider>
      <v-divider></v-divider>
      <v-divider :thickness="8" class="border-opacity-0"></v-divider>
      <v-list-item prepend-icon="mdi-application-outline" title="Basic Settings" value="basic-settings" nuxt-link to="/settings/general"></v-list-item>
      <v-list-item v-if="dataStore.get('overlaySettings').advancedMode" prepend-icon="mdi-cloud-braces" title="Advanced Settings" value="advanced-settings" nuxt-link to="/settings/advanced"></v-list-item>
      <v-list-item prepend-icon="mdi-format-list-bulleted" title="Blacklist Settings" value="blacklist-settings" nuxt-link to="/settings/blacklist"></v-list-item>
      <v-list-item prepend-icon="mdi-palette-outline" title="Appearance Settings" value="appearance-settings" nuxt-link to="/settings/appearance"></v-list-item>
      <v-list-item prepend-icon="mdi-view-column-outline" title="Column Settings" value="column-settings" nuxt-link to="/settings/column"></v-list-item>
      <v-list-item prepend-icon="mdi-bell-outline" title="Notification Settings" value="notification-settings" nuxt-link to="/settings/notification"></v-list-item>
      <v-divider :thickness="8" class="border-opacity-0"></v-divider>
      <v-divider></v-divider>
      <v-divider :thickness="8" class="border-opacity-0"></v-divider>
      <v-list-item>v{{ PackageJSON.version }}</v-list-item>
      <v-list-item style="position: fixed !important; bottom: 0 !important">
        <v-btn color="primary" variant="tonal" class="ml-1 mr-2" @click="ipcRenderer.send('link', 'https://discord.com/invite/2vAuyVvdwj')">Discord</v-btn>
        <v-btn color="secondary" variant="tonal" class="ml-2 mr-1" @click="ipcRenderer.send('link', 'https://github.com/pixelicc/pixelic-overlay')">GitHub</v-btn>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ipcRenderer } from "electron";
import dataStore from "../electron/store";
import PackageJSON from "../package.json";

const sidebar = ref(false);

const minimizeWindow = () => {
  ipcRenderer.send("window", "minimize");
};
const closeWindow = () => {
  ipcRenderer.send("window", "close");
};

const validateQuery = (query: string) => {
  if (query === "") return true;
  if (validateUsername(query)) return true;
  return false;
};

const playerSearchQuery = ref("");

const addPlayerFromQuery = () => {
  if (playerSearchQuery.value !== "" && validateQuery(playerSearchQuery.value)) {
    PlayerManager.addPlayer(playerSearchQuery.value, { force: true });
    playerSearchQuery.value = "";
  }
};

const playerStatisticsSearchQuery = ref("");

const openStatsticsFromQuery = () => {
  if (playerStatisticsSearchQuery.value !== "" && validateQuery(playerStatisticsSearchQuery.value)) {
    ipcRenderer.send("openStatistics", playerStatisticsSearchQuery.value);
    playerStatisticsSearchQuery.value = "";
  }
};

const quickSettings = ref(false);

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
