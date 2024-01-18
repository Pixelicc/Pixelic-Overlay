<template>
  <v-toolbar density="compact" style="-webkit-app-region: drag; background-color: rgba(var(--v-theme-background), calc(var(--opacity) + 0.3)) !important">
    <v-app-bar-nav-icon variant="text" @click.stop="sidebar = !sidebar" style="-webkit-app-region: no-drag"></v-app-bar-nav-icon>
    <v-toolbar-title v-if="!sidebar" class="grow">Pixelic Overlay</v-toolbar-title>
    <v-toolbar-title v-if="sidebar" class="grow" style="-webkit-app-region: no-drag">Pixelic Overlay</v-toolbar-title>
    <v-btn v-if="useRoute().path === '/'" icon @click="playerHandler.refreshPlayers" style="-webkit-app-region: no-drag">
      <v-icon color="primary">mdi-refresh</v-icon>
    </v-btn>
    <v-btn v-if="useRoute().path === '/'" icon @click="playerHandler.clearPlayers" style="-webkit-app-region: no-drag">
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
            <v-select class="mt-2" label="Gamemode" variant="outlined" color="primary" :items="Object.keys(modes)" v-model="mode" return-object @update:modelValue="setMode"></v-select>
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
    <v-list nav>
      <v-list-item prepend-icon="mdi-table" title="Overlay" value="overlay" nuxt-link to="/"></v-list-item>
      <v-list-item prepend-icon="mdi-chart-line" title="Statistics" value="statistics" nuxt-link to="/statistics"></v-list-item>
      <v-divider :thickness="8" class="border-opacity-0"></v-divider>
      <v-divider></v-divider>
      <v-divider :thickness="8" class="border-opacity-0"></v-divider>
      <v-list-item prepend-icon="mdi-application-outline" title="Basic Settings" value="basic-settings" nuxt-link to="/settings/general"></v-list-item>
      <v-list-item prepend-icon="mdi-format-list-bulleted" title="Blacklist Settings" value="blacklist-settings" nuxt-link to="/settings/blacklist"></v-list-item>
      <v-list-item prepend-icon="mdi-palette-outline" title="Appearance Settings" value="appearance-settings" nuxt-link to="/settings/appearance"></v-list-item>
      <v-list-item prepend-icon="mdi-view-column-outline" title="Column Settings" value="column-settings" nuxt-link to="/settings/column"></v-list-item>
      <v-list-item prepend-icon="mdi-bell-outline" title="Notification Settings" value="notification-settings" nuxt-link to="/settings/notification"></v-list-item>
      <v-divider :thickness="8" class="border-opacity-0"></v-divider>
      <v-divider></v-divider>
      <v-divider :thickness="8" class="border-opacity-0"></v-divider>
      <v-list-item>v{{ PackageJSON.version }}</v-list-item>
      <v-list-item style="position: fixed !important; bottom: 0 !important">
        <v-btn color="#5865F2" variant="tonal" class="ml-1 mr-2" @click="ipcRenderer.send('link', 'https://discord.com/invite/2vAuyVvdwj')">Discord</v-btn>
        <v-btn color="#6e5494" variant="tonal" class="ml-2 mr-1" @click="ipcRenderer.send('link', 'https://github.com/pixelicc/pixelic-overlay')">GitHub</v-btn>
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
    playerHandler.addPlayer(playerSearchQuery.value, { force: true });
    playerSearchQuery.value = "";
  }
};

const playerStatisticsSearchQuery = ref("");

const openStatsticsFromQuery = () => {
  if (playerStatisticsSearchQuery.value !== "" && validateQuery(playerStatisticsSearchQuery.value)) {
    /**
     *
     */
  }
};

const quickSettings = ref(false);

const modes: { [key: string]: string } = {
  Overall: "overall",
  Cores: "cores",
  Solo: "solo",
  Doubles: "doubles",
  Threes: "threes",
  Fours: "fours",
  "4v4": "4v4",
};

const reversedModes = reverseObject(modes);

const mode = ref("");
mode.value = reversedModes[dataStore.get("mode")];

const setMode = (Mode: string) => {
  dataStore.set("mode", modes[Mode]);
  mode.value = Mode;
};
</script>
