<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>General Settings</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card title="Basic">
          <v-card-text class="mt-4">
            <PlayerConfigInput class="mt-2" />
            <v-divider :thickness="8" class="border-opacity-0"></v-divider>
            <ClientConfigSelector />
            <v-divider :thickness="8" class="border-opacity-0"></v-divider>
            <KeyConfigInput class="mt-2" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card title="Hypixel Gamemode">
          <v-card-text class="mt-4">
            <v-select variant="outlined" color="secondary" :items="Object.values(Constants.overlay.supportedModes.hypixel)" prepend-icon="mdi-table-search" v-model="hypixelMode" return-object @update:modelValue="setHypixelMode"></v-select>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card title="Minigame Gamemode">
          <v-card-text class="mt-4">
            <v-select label="Bedwars" variant="outlined" color="secondary" :items="Object.values(Constants.overlay.supportedModes.bedwars)" prepend-icon="mdi-bed" v-model="bedwarsMode" return-object @update:modelValue="setBedwarsMode"></v-select>
            <v-select label="Skywars" variant="outlined" color="secondary" :items="Object.values(Constants.overlay.supportedModes.skywars)" prepend-icon="mdi-weather-cloudy" v-model="skywarsMode" return-object @update:modelValue="setSkywarsMode"></v-select>
            <v-select label="Duels" variant="outlined" color="secondary" :items="Object.values(Constants.overlay.supportedModes.duels)" prepend-icon="mdi-fencing" v-model="duelsMode" return-object @update:modelValue="setDuelsMode"></v-select>
            <v-select label="Murder Mystery" variant="outlined" color="secondary" :items="Object.values(Constants.overlay.supportedModes.murderMystery)" prepend-icon="mdi-coffin" v-model="murderMysteryMode" return-object @update:modelValue="setMurderMysteryMode"></v-select>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card title="Other">
          <v-card-text>
            <v-list density="compact">
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon>mdi-application</v-icon>
                </template>
                <template v-slot:append>
                  <v-switch color="secondary" v-model="discordRPC" @update:model-value="setDiscordRPC" style="display: flex"></v-switch>
                </template>
                <v-list-item-title>Discord Rich Presence (RPC)</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon>mdi-cloud-braces</v-icon>
                </template>
                <template v-slot:append>
                  <v-switch color="secondary" v-model="advancedMode" @update:model-value="setAdvancedMode" style="display: flex"></v-switch>
                </template>
                <v-list-item-title>Advanced Mode (Developer Mode)</v-list-item-title>
                <v-list-item-subtitle>Gives you access to restricted Features (DO NOT ENABLE THIS IF YOU DO NOT KNOW WHAT YOU ARE DOING)</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ipcRenderer } from "electron";
import dataStore from "../../electron/store";

const hypixelMode = ref(Constants.overlay.supportedModes.hypixel[GamemodeManager.hypixelMode.value]);
const setHypixelMode = () => {
  dataStore.set("hypixelSettings.mode", reverseObject(Constants.overlay.supportedModes.hypixel)[hypixelMode.value]);
};
// @ts-ignore
const bedwarsMode = ref(Constants.overlay.supportedModes.bedwars[GamemodeManager.bedwarsMode.value]);
const setBedwarsMode = () => {
  dataStore.set("hypixelSettings.bedwarsSettings.mode", reverseObject(Constants.overlay.supportedModes.bedwars)[bedwarsMode.value]);
};
// @ts-ignore
const skywarsMode = ref(Constants.overlay.supportedModes.skywars[GamemodeManager.skywarsMode.value]);
const setSkywarsMode = () => {
  dataStore.set("hypixelSettings.skywarsSettings.mode", reverseObject(Constants.overlay.supportedModes.skywars)[skywarsMode.value]);
};
// @ts-ignore
const duelsMode = ref(Constants.overlay.supportedModes.duels[GamemodeManager.duelsMode.value]);
const setDuelsMode = () => {
  dataStore.set("hypixelSettings.duelsSettings.mode", reverseObject(Constants.overlay.supportedModes.duels)[duelsMode.value]);
};
// @ts-ignore
const murderMysteryMode = ref(Constants.overlay.supportedModes.murderMystery[GamemodeManager.murderMysteryMode.value]);
const setMurderMysteryMode = () => {
  dataStore.set("hypixelSettings.murderMysterySettings.mode", reverseObject(Constants.overlay.supportedModes.murderMystery)[murderMysteryMode.value]);
};

const discordRPC = ref(dataStore.get("overlaySettings").discordRPC);
const setDiscordRPC = async () => {
  dataStore.set("overlaySettings.discordRPC", discordRPC.value);
  if (discordRPC.value) ipcRenderer.send("discordRPC", await parseUUID(dataStore.get("overlaySettings").username));
};

const advancedMode = ref(dataStore.get("overlaySettings").advancedMode);
const setAdvancedMode = async () => {
  dataStore.set("overlaySettings.advancedMode", advancedMode.value);
};
</script>
