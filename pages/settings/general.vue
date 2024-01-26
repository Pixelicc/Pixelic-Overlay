<template>
  <v-app>
    <Navigation />
    <NuxtPage />
    <v-container>
      <v-row>
        <v-col>
          <h2>General Settings</h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card title="Basic">
            <div class="ml-4 mr-4 mt-4">
              <v-text-field :rules="[validateUsername]" variant="outlined" color="secondary" clearable label="Username" persistent-placeholder placeholder="Pixelic" prepend-icon="mdi-account" v-model="player" @update:model-value="setPlayer"></v-text-field>
              <v-divider :thickness="8" class="border-opacity-0"></v-divider>
              <v-select label="Client / Log File" variant="outlined" color="secondary" :items="Object.values(Constants.overlay.supportedClients)" prepend-icon="mdi-file" v-model="client" return-object @update:model-value="setClient"></v-select>
              <v-divider v-if="client === 'Custom'" :thickness="8" class="border-opacity-0"></v-divider>
              <div v-if="client === 'Custom'"><v-text-field clearable label="Custom Log File Location" variant="outlined" color="secondary" prepend-icon="mdi-file-edit" v-model="customLogPath" @update:model-value="setCustomLogPath" :rules="[validatePath]"></v-text-field></div>
              <v-divider :thickness="8" class="border-opacity-0"></v-divider>
              <div class="d-flex justify-center">
                <v-text-field :rules="[validateAPIKey]" variant="outlined" color="secondary" clearable label="Pixelic API-Key" persistent-placeholder placeholder="00000000-0000-0000-0000-000000000000" prepend-icon="mdi-cloud-key" v-model="APIKey" @update:model-value="setAPIKey"></v-text-field>
                <v-btn class="ml-8 mt-2" variant="outlined" color="secondary" @click="ipcRenderer.send('link', 'https://discord.com/api/oauth2/authorize?client_id=1176611079560904744&response_type=code&redirect_uri=https%3A%2F%2Fapi.pixelic.de%2Foauth%2Fdiscord%3Faction%3Duser.create&scope=identify')">Get API-Key</v-btn>
                <v-btn class="ml-8 mt-2" variant="outlined" color="warning" @click="ipcRenderer.send('link', 'https://discord.com/api/oauth2/authorize?client_id=1176611079560904744&response_type=code&redirect_uri=https%3A%2F%2Fapi.pixelic.de%2Foauth%2Fdiscord%3Faction%3Duser.key.regenerate&scope=identify')">Regenerate API-Key</v-btn>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card title="Hypixel Gamemode">
            <div class="ml-4 mr-4 mt-4">
              <v-select variant="outlined" color="secondary" :items="Object.values(Constants.overlay.supportedModes.hypixel)" prepend-icon="mdi-table-search" v-model="hypixelMode" return-object @update:modelValue="setHypixelMode"></v-select>
            </div>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card title="Minigame Gamemode">
            <div class="ml-4 mr-4 mt-4">
              <v-select label="Bedwars" variant="outlined" color="secondary" :items="Object.values(Constants.overlay.supportedModes.bedwars)" prepend-icon="mdi-bed" v-model="bedwarsMode" return-object @update:modelValue="setBedwarsMode"></v-select>
              <v-select label="Skywars" variant="outlined" color="secondary" :items="Object.values(Constants.overlay.supportedModes.skywars)" prepend-icon="mdi-weather-cloudy" v-model="skywarsMode" return-object @update:modelValue="setSkywarsMode"></v-select>
              <v-select label="Duels" variant="outlined" color="secondary" :items="Object.values(Constants.overlay.supportedModes.duels)" prepend-icon="mdi-fencing" v-model="duelsMode" return-object @update:modelValue="setDuelsMode"></v-select>
              <v-select label="Murder Mystery" variant="outlined" color="secondary" :items="Object.values(Constants.overlay.supportedModes.murderMystery)" prepend-icon="mdi-coffin" v-model="murderMysteryMode" return-object @update:modelValue="setMurderMysteryMode"></v-select>
            </div>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card title="Other">
            <div class="ml-4 mr-4">
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
                  <v-list-item-subtitle> Gives you access to restricted Features (DO NOT ENABLE THIS IF YOU DO NOT KNOW WHAT YOU ARE DOING) </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <Notification />
  </v-app>
</template>

<script setup lang="ts">
import { ipcRenderer } from "electron";
import dataStore from "../../electron/store";

const player = ref(dataStore.get("overlaySettings").username);
const setPlayer = () => {
  if (validateUsername(player.value)) {
    dataStore.set("overlaySettings.username", player.value);
  }
};

const client = ref(Constants.overlay.supportedClients[dataStore.get("overlaySettings").client]);
const setClient = () => {
  dataStore.set("overlaySettings.client", reverseObject(Constants.overlay.supportedClients)[client.value]);
  ipcRenderer.send("mcLogStopTailing");
  ipcRenderer.send("mcLogInitTailing", { client: dataStore.get("overlaySettings").client, customLogPath: dataStore.get("overlaySettings").customLogPath });
};

const validatePath = async (Path: string): Promise<boolean> => {
  ipcRenderer.send("mcLogCheckPath", Path);
  return new Promise((resolve) => {
    return ipcRenderer.once("mcLogCheckPathCallback", (event, msg) => {
      resolve(msg);
    });
  });
};

const customLogPath = ref(dataStore.get("overlaySettings").customLogPath);
const setCustomLogPath = async () => {
  if (await validatePath(customLogPath.value)) {
    dataStore.set("overlaySettings.customLogPath", customLogPath.value);
    ipcRenderer.send("mcLogStopTailing");
    ipcRenderer.send("mcLogInitTailing", { client: dataStore.get("overlaySettings").client, customLogPath: dataStore.get("overlaySettings").customLogPath });
  }
};

const validateAPIKey = async (key: string) => {
  if (!validateUUID(key)) return false;
  const { data, error } = await PixelicAPI("/v1/user");
  if (error.value) return false;
  return (data.value as any).success;
};

const APIKey = ref(dataStore.get("APISettings").key);
const setAPIKey = () => {
  if (validateUUID(APIKey.value)) {
    dataStore.set("APISettings.key", formatUUID(APIKey.value));
  }
};

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
