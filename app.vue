<template>
  <v-app>
    <NuxtLayout>
      <v-main>
        <SetupGuide v-if="setupRequired" />
        <div v-if="!setupRequired">
          <Navigation />
          <NuxtPage />
          <Notification />
        </div>
      </v-main>
    </NuxtLayout>
  </v-app>
</template>

<script setup lang="ts">
import { ipcRenderer } from "electron";
import dataStore from "./electron/store.js";

const setupRequired = ref(false);
if (dataStore.get("APISettings").key.length === 0 || dataStore.get("overlaySettings").username.length === 0) setupRequired.value = true;

console.log(`%c[Pixelic-Overlay] Loaded in ${process.env.VITE_DEV_SERVER_URL ? "DEV" : "PROD"} Mode`, "color: #c094cc");

ipcRenderer.on("mcChatMessage", (event, msg) => {
  MessageManager.submitMessage(msg);
});

PlayerManager.addPlayer(dataStore.get("overlaySettings").username, { force: true });
if (dataStore.get("overlaySettings").discordRPC === true) {
  console.log(`%c[DiscordRPC] Connecting to socket...`, "color: #c37892");
  parseUUID(dataStore.get("overlaySettings").username).then((UUID) => ipcRenderer.send("discordRPC", UUID));
}

TagManager.updateTags();
setInterval(() => TagManager.updateTags(), 300 * 1000);

BlacklistManager.updatePersonalBlacklist();
setInterval(() => BlacklistManager.updatePersonalBlacklist(), 300 * 1000);

BlacklistManager.updateCustomBlacklists();
setInterval(() => BlacklistManager.updateCustomBlacklists(), 300 * 1000);

(document.querySelector(":root") as HTMLElement).style.setProperty("--opacity", dataStore.get("appearanceSettings").opacity);
</script>
