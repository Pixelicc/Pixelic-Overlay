<template>
  <v-app>
    <Navigation />
    <NuxtPage />
    <v-container>
      <v-row>
        <v-col>
          <h2>Notification Settings</h2>
          Notifications might not work without changing your Operating System's Notification Settings
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card>
            <div class="ml-4 mr-4">
              <v-list density="compact">
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon>mdi-clock-fast</v-icon>
                  </template>
                  <template v-slot:append>
                    <v-switch color="secondary" v-model="gameStartNotification" @change="toggleGameStartNotification" style="display: flex"></v-switch>
                  </template>
                  <v-list-item-title>Game started</v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon>mdi-human-queue</v-icon>
                  </template>
                  <template v-slot:append>
                    <v-switch color="secondary" v-model="queueNotification" @change="toggleQueueNotification" style="display: flex"></v-switch>
                  </template>
                  <v-list-item-title>Queued</v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon>mdi-target-account</v-icon>
                  </template>
                  <template v-slot:append>
                    <v-switch color="secondary" v-model="blacklistNotification" @change="toggleBlacklistNotification" style="display: flex"></v-switch>
                  </template>
                  <v-list-item-title>Cheater/Sniper</v-list-item-title>
                  <v-list-item-subtitle>Triggered once a blacklisted player enters your queue.</v-list-item-subtitle>
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
import dataStore from "../../electron/store";

const gameStartNotification = ref(false);
gameStartNotification.value = dataStore.get("gameStartNotification");
const toggleGameStartNotification = () => dataStore.set("gameStartNotification", gameStartNotification.value);

const queueNotification = ref(false);
queueNotification.value = dataStore.get("queueNotification");
const toggleQueueNotification = () => dataStore.set("queueNotification", queueNotification.value);

const blacklistNotification = ref(false);
blacklistNotification.value = dataStore.get("blacklistNotification");
const toggleBlacklistNotification = () => dataStore.set("blacklistNotification", blacklistNotification.value);
</script>
