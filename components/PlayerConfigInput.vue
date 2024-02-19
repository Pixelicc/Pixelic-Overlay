<template>
  <v-text-field :rules="[validateUsername]" variant="outlined" color="secondary" clearable label="Username" persistent-placeholder placeholder="Pixelic" prepend-icon="mdi-account" v-model="player" @update:model-value="setPlayer"></v-text-field>
</template>

<script setup lang="ts">
import dataStore from "../electron/store";

const player = ref(dataStore.get("overlaySettings").username);
const setPlayer = () => {
  if (validateUsername(player.value)) {
    dataStore.set("overlaySettings.username", player.value);
  }
};
</script>
