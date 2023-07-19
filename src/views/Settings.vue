<template>
  <main id="settings">
    <v-app>
      <v-container>
        <v-row>
          <v-col class="justify-center">
            <v-card><v-text-field :rules="[validPlayer]" clearable label="Hypixel Username or UUID" persistent-placeholder placeholder="Pixelic or 14727fae-fbdc-4aff-848c-d2713eb9939e" prepend-inner-icon="mdi-account" v-model="getPlayer" return-object @update:modelValue="setPlayer"></v-text-field></v-card>
            <v-divider :thickness="8" class="border-opacity-0"></v-divider>
            <v-card class="d-flex justify-center">
              <v-text-field :type="keyShown ? 'text' : 'password'" :append-icon="keyShown ? 'mdi-eye' : 'mdi-eye-off'" @click:append="toggleKeyShow" clearable label="Pixelic-API Key" persistent-placeholder :placeholder="keyPlaceHolder" prepend-inner-icon="mdi-key" v-model="getKey" return-object @update:modelValue="setKey" :error-messages="keyErrors"></v-text-field>
              <v-btn class="ml-4 mr-4 mt-4" variant="outlined" elevation="0" rounded="lg" @click="requestDiscordAuth">Get API-Key</v-btn>
            </v-card>
            <v-divider :thickness="64" class="border-opacity-0"></v-divider>
            <v-card><v-select label="Bedwars Gamemode" :items="modes" prepend-inner-icon="mdi-bed-empty" v-model="getMode" return-object @update:modelValue="setMode"></v-select></v-card>
            <v-divider :thickness="8" class="border-opacity-0"></v-divider>
            <v-card><v-select label="Client / Log File" :items="clients" prepend-inner-icon="mdi-file" v-model="getClient" return-object @update:modelValue="setClient"></v-select></v-card>
            <v-divider v-if="getClient === 'Custom'" :thickness="8" class="border-opacity-0"></v-divider>
            <v-card v-if="getClient === 'Custom'"><v-text-field clearable label="Custom Log File Location" prepend-inner-icon="mdi-file" v-model="getCustomLogFile" return-object @update:modelValue="setCustomLogFile"></v-text-field></v-card>
            <v-divider :thickness="8" class="border-opacity-0"></v-divider>
            <v-card><v-select label="Overlay Stats" :items="colums" prepend-inner-icon="mdi-table-edit" chips multiple v-model="getColums" return-object @update:modelValue="setColums"></v-select></v-card>
            <v-divider :thickness="4" class="border-opacity-0"></v-divider>
            <v-card><v-switch class="ma-2" v-model="hideIngame" color="info" inset hide-details @change="toggleHideIngame" :label="hideIngame === true ? 'Hide Overlay Ingame : Enabled' : 'Hide Overlay Ingame : Disabled'"></v-switch></v-card>
            <v-divider :thickness="64" class="border-opacity-0"></v-divider>
            <v-card><v-select label="Theme" :items="themes" prepend-inner-icon="mdi-palette-outline" v-model="currentTheme" return-object @update:modelValue="setTheme"></v-select></v-card>
            <v-divider v-if="theme.global.name.value === 'custom'" :thickness="8" class="border-opacity-0"></v-divider>
            <v-card v-if="theme.global.name.value === 'custom'"><v-select label="Component" :items="themeComponents" prepend-inner-icon="mdi-palette-outline" v-model="previewedComponent" return-object @update:modelValue="setThemeComponent"></v-select></v-card>
            <v-divider v-if="theme.global.name.value === 'custom'" :thickness="8" class="border-opacity-0"></v-divider>
            <v-color-picker v-if="theme.global.name.value === 'custom'" return-object @update:modelValue="setThemeComponentColor" hide-inputs mode="hex"></v-color-picker>
            <v-divider v-if="theme.global.name.value === 'custom'" :thickness="8" class="border-opacity-0"></v-divider>
            <v-divider :thickness="64" class="border-opacity-0"></v-divider>
            <v-card><v-switch class="ma-2" v-model="discordRPC" color="info" inset hide-details @change="toggleDiscordRPC" :label="discordRPC === true ? 'Discord RPC : Enabled' : 'Discord RPC: Disabled'"></v-switch></v-card>
            <v-divider :thickness="64" class="border-opacity-0"></v-divider>
            <v-card><v-switch class="ma-2" v-model="developerMode" color="info" inset hide-details @change="toggleDeveloperMode" :label="developerMode === true ? 'Developer Mode : Enabled' : 'Developer Mode : Disabled (Do not enable this if you do not know what you are doing!)'"></v-switch></v-card>
            <v-divider :thickness="64" class="border-opacity-0"></v-divider>
          </v-col>
        </v-row>
        <v-row align="end" no-gutters>
          <v-col class="d-flex justify-center">
            <v-card color="transparent"> Version: {{ version }} </v-card>
          </v-col>
        </v-row>
        <v-row align="end" no-gutters>
          <v-col class="d-flex justify-center">
            <v-card>
              <v-btn @click="sendSocial"><strong>Made by Pixelic</strong></v-btn>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-app>
  </main>
</template>

<script setup>
import { ref } from "vue";
import { useTheme } from "vuetify";
import axios from "axios";
import { useIpcRenderer } from "@vueuse/electron";
import { clear } from "../misc/overlay";

import PackageJSON from "../../package.json";
import dataStore from "../data/dataStore";

const version = PackageJSON.version;

const ipcRenderer = useIpcRenderer();

const developerMode = ref(0);
developerMode.value = dataStore.get("developerMode");

const toggleDeveloperMode = () => {
  dataStore.set("developerMode", developerMode.value);
  clear();
  ipcRenderer.send("devTools", developerMode.value);
};

const discordRPC = ref(0);
discordRPC.value = dataStore.get("discordRPC");

const toggleDiscordRPC = () => {
  dataStore.set("discordRPC", discordRPC.value);
  ipcRenderer.send("discordRPC-set", discordRPC.value);
  ipcRenderer.send("discordRPC-init", [dataStore.get("player"), dataStore.get("pixelicKey")]);
};

const setPlayer = (player) => {
  dataStore.set("player", player);
};

const getPlayer = ref(0);
getPlayer.value = dataStore.get("player");

const requestDiscordAuth = () => ipcRenderer.send("discordAuth");

var keyPlaceHolder = ref(0);
if (dataStore.get("pixelicKey") === "") keyPlaceHolder.value = "An Discord OAuth Page should have opened in your browser! Paste the key here!";
else keyPlaceHolder.value = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

var keyShown = ref(0);
keyShown.value = false;

const toggleKeyShow = () => {
  keyShown.value = !keyShown.value;
};

var keyErrors = ref(0);
keyErrors.value = [];

const setKey = (key) => {
  if (key === undefined) {
    keyErrors.value = ["An API-Key is required to be able to use this Overlay!"];
    return;
  }
  key = key.replace(/-/g, "");
  if (key.length !== 32) {
    keyErrors.value = ["Invalid API Key!"];
    return;
  }
  if (/[0-9a-fA-F]{12}4[0-9a-fA-F]{19}/.test(key)) {
    axios
      .get("https://api.pixelic.de/v1/key", { headers: { "X-API-Key": key } })
      .then(() => {
        keyErrors.value = [];
        dataStore.set("pixelicKey", key);
        return true;
      })
      .catch((error) => {
        if (error?.response?.status) {
          if (error.response.status === 403) {
            keyErrors.value = ["Invalid API Key!"];
            return;
          }
        }
        keyErrors.value = ["An error occured whilst trying to validate your API Key! Please try again later!"];
        return;
      });
  } else {
    keyErrors.value = ["Invalid API Key!"];
    return;
  }
};

const getKey = ref(0);
getKey.value = dataStore.get("pixelicKey");

const modes = ["Overall", "Cores", "Solo", "Doubles", "Threes", "Fours", "4v4"];

const setMode = (mode) => {
  dataStore.set("mode", mode);
};

const getMode = ref(0);
getMode.value = dataStore.get("mode").charAt(0).toUpperCase() + dataStore.get("mode").slice(1);

const clients = ["Vanilla", "Lunar", "Badlion", "Custom (Requires restart after location change)"];

const setClient = (client) => {
  dataStore.set("client", client.split(" ")[0]);
  ipcRenderer.send("logChange", null);
};

const getClient = ref(0);
getClient.value = dataStore.get("client").charAt(0).toUpperCase() + dataStore.get("client").slice(1);

const setCustomLogFile = (path) => {
  dataStore.set("customLogFilePath", path);
};

const getCustomLogFile = ref(0);
getCustomLogFile.value = dataStore.get("customLogFilePath");

const hideIngame = ref(0);
hideIngame.value = dataStore.get("hideIngame");

const toggleHideIngame = () => {
  dataStore.set("hideIngame", hideIngame.value);
};

const colums = ["WS", "Wins", "WLR", "Finals", "FKDR", "BBLR"];

const getColums = ref(0);
getColums.value = dataStore.get("colums");

const setColums = (selectedColums) => {
  dataStore.set("colums", selectedColums);
  getColums = selectedColums;
};

const theme = useTheme();
const currentTheme = ref(0);
currentTheme.value = theme.global.name.value.charAt(0).toUpperCase() + theme.global.name.value.slice(1);
const themes = ["Dark 🌙", "Light 💡", "Sakura 🌸", "Custom 🎨"];

const setTheme = (selectedTheme) => {
  theme.global.name.value = selectedTheme.split(" ")[0].toLowerCase();
  dataStore.set("selectedTheme", selectedTheme.split(" ")[0].toLowerCase());
};

const themeComponents = ["Background", "Primary", "Secondary", "Error", "Info", "Success", "Warning"];
const selectedComponent = ref(0);
const previewedComponent = ref(0);

previewedComponent.value = "Background";

const setThemeComponent = (component) => {
  selectedComponent.value = component.toLowerCase();
};

setThemeComponent("Background");

var reloadingTheme = false;

const reloadTheme = () => {
  theme.global.name.value = "dark";
  theme.global.name.value = "custom";

  new Promise((r) => setTimeout(r, 100)).then(() => {
    reloadingTheme = false;
  });
};

const setThemeComponentColor = (selectedColor) => {
  if (selectedColor === undefined) return;

  theme.global.current["_value"].colors[selectedComponent.value] = selectedColor;

  dataStore.set("customTheme", { ...dataStore.get("customTheme"), colors: { ...dataStore.get("customTheme").colors, [selectedComponent.value]: selectedColor } });

  if (!reloadingTheme) {
    reloadingTheme = true;
    reloadTheme();
  }
};

const validPlayer = (value) => {
  if (value === undefined) return "To get the best experience using this Overlay you should enter your Hypixel Username or UUID!";
  if (/^[a-zA-Z0-9_]{2,16}$/gm.test(value)) return true;
  value = value.replace(/-/g, "");
  if (value.length !== 32) {
    return "Invalid Hypixel Username or UUID!";
  }
  if (/[0-9a-fA-F]{12}4[0-9a-fA-F]{19}/.test(value)) return true;
  return "Invalid Hypixel Username or UUID!";
};

const sendSocial = () => {
  ipcRenderer.send("socials", "https://discord.com/invite/2vAuyVvdwj");
};
</script>
