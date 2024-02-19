<template>
  <div class="d-flex justify-center">
    <v-text-field :rules="[validateAPIKey]" variant="outlined" color="secondary" clearable label="Pixelic API-Key" persistent-placeholder placeholder="00000000-0000-0000-0000-000000000000" prepend-icon="mdi-cloud-key" v-model="APIKey" @update:model-value="setAPIKey"></v-text-field>
    <v-btn class="ml-8 mt-2" variant="outlined" color="secondary" @click="ipcRenderer.send('link', 'https://discord.com/api/oauth2/authorize?client_id=1176611079560904744&response_type=code&redirect_uri=https%3A%2F%2Fapi.pixelic.app%2Foauth%2Fdiscord%3Faction%3Duser.create&scope=identify')">Get API-Key</v-btn>
    <v-btn class="ml-8 mt-2" variant="outlined" color="warning" @click="ipcRenderer.send('link', 'https://discord.com/api/oauth2/authorize?client_id=1176611079560904744&response_type=code&redirect_uri=https%3A%2F%2Fapi.pixelic.app%2Foauth%2Fdiscord%3Faction%3Duser.key.regenerate&scope=identify')">Regenerate API-Key</v-btn>
  </div>
</template>

<script setup lang="ts">
import dataStore from "../electron/store";
import { ipcRenderer } from "electron";

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
</script>
