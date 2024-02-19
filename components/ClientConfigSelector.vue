<template>
  <div>
    <v-select label="Client / Log File" variant="outlined" color="secondary" :items="Object.values(Constants.overlay.supportedClients)" prepend-icon="mdi-file" v-model="client" return-object @update:model-value="setClient"></v-select>
    <v-divider v-if="client === 'Custom'" :thickness="8" class="border-opacity-0"></v-divider>
    <v-text-field v-if="client === 'Custom'" clearable label="Custom Log File Location" variant="outlined" color="secondary" prepend-icon="mdi-file-edit" v-model="customLogPath" @update:model-value="setCustomLogPath" :rules="[validatePath]"></v-text-field>
  </div>
</template>

<script setup lang="ts">
import { ipcRenderer } from "electron";
import dataStore from "../electron/store";

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
</script>
