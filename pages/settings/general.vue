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
              <v-select label="Client / Log File" variant="outlined" color="secondary" :items="clients" prepend-icon="mdi-file" v-model="client" return-object @update:model-value="setClient"></v-select>
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
          <v-card title="Bedwars">
            <div class="ml-4 mr-4 mt-4">
              <v-select label="Gamemode" variant="outlined" color="secondary" :items="Object.keys(modes)" prepend-icon="mdi-bed-empty" v-model="mode" return-object @update:modelValue="setMode"></v-select>
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
                  <v-list-item-title>Discord Rich Presence</v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon>mdi-cloud-braces</v-icon>
                  </template>
                  <template v-slot:append>
                    <v-switch color="secondary" v-model="advancedMode" @update:model-value="setAdvancedMode" style="display: flex"></v-switch>
                  </template>
                  <v-list-item-title>Advanced Mode (Developer Mode)</v-list-item-title>
                  <v-list-item-subtitle>Gives you access to restricted Features &mdash; DO NOT ENABLE THIS IF YOU DO NOT KNOW WHAT YOU ARE DOING</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script setup lang="ts">
import { ipcRenderer } from "electron";
import dataStore from "../../electron/store";

const player = ref("");
player.value = dataStore.get("player");

const setPlayer = () => {
  if (validateUsername(player.value)) {
    dataStore.set("player", player.value);
  }
};

const clients = ["Default", "Lunar", "Badlion", "Custom"];

const client = ref("");
client.value = dataStore.get("client").charAt(0) + dataStore.get("client").toLowerCase().slice(1);

const setClient = (Client: string) => {
  dataStore.set("client", Client.toUpperCase());
  client.value = dataStore.get("client").charAt(0) + dataStore.get("client").toLowerCase().slice(1);
  ipcRenderer.send("mcLogStopTailing");
  ipcRenderer.send("mcLogInitTailing", { client: client.value.toUpperCase(), customLogPath: customLogPath.value });
};

const validatePath = async (Path: string): Promise<boolean> => {
  ipcRenderer.send("mcLogCheckPath", Path);
  return new Promise((resolve) => {
    return ipcRenderer.once("mcLogCheckPathCallback", (event, msg) => {
      resolve(msg);
    });
  });
};

const customLogPath = ref("");
customLogPath.value = dataStore.get("customLogPath");

const setCustomLogPath = async () => {
  if (await validatePath(customLogPath.value)) {
    dataStore.set("customLogPath", customLogPath.value);
    ipcRenderer.send("mcLogStopTailing");
    ipcRenderer.send("mcLogInitTailing", { client: client.value.toUpperCase(), customLogPath: customLogPath.value });
  }
};

const APIKey = ref("");
APIKey.value = dataStore.get("APIKey");

const validateAPIKey = async (key: string) => {
  if (!validateUUID(key)) return false;
  const { data, error } = await useFetch(`${process.env.VITE_DEV_SERVER_URL ? "http://localhost:3000" : "https://api.pixelic.de"}/v1/user`, {
    headers: {
      "X-API-Key": dataStore.get("APIKey"),
    },
  });
  if (error.value) return false;
  return (data.value as any).success;
};

const setAPIKey = () => {
  if (validateUUID(APIKey.value)) {
    dataStore.set("APIKey", formatUUID(APIKey.value));
  }
};

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

const discordRPC = ref(false);
discordRPC.value = dataStore.get("discordRPC");

const setDiscordRPC = async (DiscordRPC: boolean | null) => {
  if (DiscordRPC === true || DiscordRPC === false) {
    dataStore.set("discordRPC", DiscordRPC);
    discordRPC.value = dataStore.get("discordRPC");
    if (discordRPC) ipcRenderer.send("discordRPCInit", await parseUUID(dataStore.get("player")));
  }
};

const advancedMode = ref(false);
advancedMode.value = dataStore.get("advancedMode");

const setAdvancedMode = async (AdvancedMode: boolean | null) => {
  if (AdvancedMode === true || AdvancedMode === false) {
    dataStore.set("advancedMode", AdvancedMode);
    advancedMode.value = dataStore.get("advancedMode");
  }
};
</script>
