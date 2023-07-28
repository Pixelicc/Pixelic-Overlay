<template>
  <v-app>
    <v-container>
      <v-row>
        <v-col>
          <h2>Basic Settings</h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card title="General">
            <div class="ml-4 mr-4 mt-4">
              <v-text-field :rules="[validPlayer]" variant="outlined" clearable label="Username / UUID" persistent-placeholder placeholder="Pixelic or 14727fae-fbdc-4aff-848c-d2713eb9939e" prepend-icon="mdi-account" v-model="getPlayer" return-object @update:modelValue="setPlayer"></v-text-field>
              <v-divider :thickness="8" class="border-opacity-0"></v-divider>
              <v-select label="Client / Log File" variant="outlined" :items="clients" prepend-icon="mdi-file" v-model="getClient" return-object @update:modelValue="setClient"></v-select>
              <v-divider v-if="getClient === 'Custom'" :thickness="8" class="border-opacity-0"></v-divider>
              <div v-if="getClient === 'Custom'"><v-text-field clearable label="Custom Log File Location" variant="outlined" prepend-icon="mdi-file-edit" v-model="getCustomLogFile" return-object @update:modelValue="setCustomLogFile"></v-text-field></div>
              <v-divider :thickness="8" class="border-opacity-0"></v-divider>
              <div class="d-flex justify-center">
                <v-text-field :type="keyShown ? 'text' : 'password'" :append-icon="keyShown ? 'mdi-eye' : 'mdi-eye-off'" variant="outlined" @click:append="toggleKeyShow" label="Pixelic API-Key" persistent-placeholder :placeholder="keyPlaceHolder" prepend-icon="mdi-key" v-model="getKey" return-object @update:modelValue="setKey" :error-messages="keyErrors"></v-text-field>
                <v-btn class="ml-4 mr-4 mt-3" variant="outlined" elevation="0" rounded="lg" @click="requestDiscordAuth">Get API-Key</v-btn>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card title="Bedwars">
            <div class="ml-4 mr-4 mt-4">
              <v-select label="Gamemode" variant="outlined" :items="modes" prepend-icon="mdi-bed-empty" v-model="getMode" return-object @update:modelValue="setMode"></v-select>
            </div>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card title="Other">
            <div class="ml-4 mr-4 mt-4">
              <v-list density="compact">
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon>mdi-application</v-icon>
                  </template>
                  <template v-slot:append>
                    <v-switch color="secondary" v-model="discordRPC" @change="toggleDiscordRPC" style="display: flex"></v-switch>
                  </template>
                  <v-list-item-title>Discord Rich Presence</v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon>mdi-code-tags</v-icon>
                  </template>
                  <template v-slot:append>
                    <v-switch color="secondary" v-model="developerMode" @change="toggleDeveloperMode" style="display: flex"></v-switch>
                  </template>
                  <v-list-item-title>Developer Mode</v-list-item-title>
                  <v-list-item-subtitle>Do not enable this if you do not know what you are doing!</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script setup>
import dataStore from "../../data/dataStore";
import { ref } from "vue";
import axios from "axios";
import { useIpcRenderer } from "@vueuse/electron";
import { clear } from "../../misc/overlay";
const ipcRenderer = useIpcRenderer();

const setPlayer = (player) => {
  dataStore.set("player", player);
};

const getPlayer = ref(0);
getPlayer.value = dataStore.get("player");

const validPlayer = (value) => {
  if (value === undefined) return "To get the best experience using this Overlay you should enter your Hypixel Username or UUID!";
  if (/^[a-zA-Z0-9_]{2,16}$/gm.test(value)) return true;
  value = value.replace(/-/g, "");
  if (value.length !== 32) {
    return "Invalid Username or UUID!";
  }
  if (/[0-9a-fA-F]{12}4[0-9a-fA-F]{19}/.test(value)) return true;
  return "Invalid Username or UUID!";
};

const clients = ["Default (Vanilla/LabyMod/Forge)", "Lunar", "Badlion", "Custom (Requires restart after location change)"];

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

const requestDiscordAuth = () => ipcRenderer.send("discordAuth");

var keyPlaceHolder = ref(0);
if (dataStore.get("pixelicKey") === "") keyPlaceHolder.value = "An Discord OAuth Page should have opened in your browser!";
else keyPlaceHolder.value = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx".replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, "$1-$2-$3-$4-$5");

var keyShown = ref(0);
keyShown.value = false;

const toggleKeyShow = () => {
  keyShown.value = !keyShown.value;
};

var keyErrors = ref(0);
keyErrors.value = [];

const setKey = (key) => {
  if (key === "" || key === undefined) {
    keyErrors.value = ["An Pixelic API-Key is required to use this Overlay!"];
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
getKey.value = dataStore.get("pixelicKey").replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, "$1-$2-$3-$4-$5");

const modes = ["Overall", "Cores", "Solo", "Doubles", "Threes", "Fours", "4v4"];

const setMode = (mode) => {
  dataStore.set("mode", mode);
};

const getMode = ref(0);
getMode.value = dataStore.get("mode").charAt(0).toUpperCase() + dataStore.get("mode").slice(1);

const discordRPC = ref(0);
discordRPC.value = dataStore.get("discordRPC");

const toggleDiscordRPC = () => {
  dataStore.set("discordRPC", discordRPC.value);
  ipcRenderer.send("discordRPC-set", discordRPC.value);
  ipcRenderer.send("discordRPC-init", [dataStore.get("player"), dataStore.get("pixelicKey")]);
};

const developerMode = ref(0);
developerMode.value = dataStore.get("developerMode");

const toggleDeveloperMode = () => {
  dataStore.set("developerMode", developerMode.value);
  clear();
  ipcRenderer.send("devTools", developerMode.value);
};
</script>
