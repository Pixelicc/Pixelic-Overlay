<template>
  <v-toolbar density="compact" style="-webkit-app-region: drag; background-color: rgba(var(--v-theme-background), calc(var(--opacity) + 0.3)) !important">
    <v-toolbar-title class="grow">Pixelic Overlay</v-toolbar-title>
    <v-btn icon @click="minimizeWindow" style="-webkit-app-region: no-drag">
      <v-icon>mdi-minus</v-icon>
    </v-btn>
    <v-btn icon @click="closeWindow" style="-webkit-app-region: no-drag">
      <v-icon>mdi-window-close</v-icon>
    </v-btn>
  </v-toolbar>
  <v-container>
    <v-stepper v-model="step" show-actions style="background-color: rgba(var(--v-theme-background)) !important">
      <v-stepper-header>
        <v-stepper-item title="Login/Authentication" value="1" :complete="step > 0"></v-stepper-item>
        <v-divider></v-divider>
        <v-stepper-item title="Username" value="2" :complete="step > 1"></v-stepper-item>
        <v-divider></v-divider>
        <v-stepper-item title="Client" value="3" :complete="step > 2"></v-stepper-item>
        <v-divider></v-divider>
        <v-stepper-item title="Gamemode" value="4" :complete="step > 3"></v-stepper-item>
      </v-stepper-header>
      <v-stepper-window>
        <v-stepper-window-item> If you see this, something went wrong. </v-stepper-window-item>
        <!-- I don't know why I need to add this useless Component for the v-stepper to work :/ -->
        <v-stepper-window-item>
          <KeyConfigInput class="mt-2" />
        </v-stepper-window-item>
        <v-stepper-window-item>
          <PlayerConfigInput class="mt-2" />
        </v-stepper-window-item>
        <v-stepper-window-item>
          <ClientConfigSelector class="mt-2" />
        </v-stepper-window-item>
        <v-stepper-window-item>
          <GamemodeSelector class="mt-2" />
        </v-stepper-window-item>
      </v-stepper-window>
      <v-stepper-actions>
        <template v-slot:next>
          <v-btn @click="step === 3 ? done() : increment()" :disabled="false">{{ step === 3 ? "Finish" : "Next" }}</v-btn>
        </template>
        <template v-slot:prev>
          <v-btn @click="decrement"></v-btn>
        </template>
      </v-stepper-actions>
    </v-stepper>
  </v-container>
</template>

<script setup lang="ts">
import { ipcRenderer } from "electron";

const minimizeWindow = () => {
  ipcRenderer.send("window", "minimize");
};
const closeWindow = () => {
  ipcRenderer.send("window", "close");
};

const step = ref(0);

const increment = () => step.value++;
const decrement = () => step.value--;

const done = () => {
  reloadNuxtApp();
};
</script>
