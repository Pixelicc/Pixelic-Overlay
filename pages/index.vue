<template>
  <v-app>
    <Navigation />
    <NuxtPage />
    <PlayerTable />
  </v-app>
</template>

<script setup lang="ts"></script>

<style>
::-webkit-scrollbar {
  display: none;
}

.v-application {
  background-color: rgba(var(--v-theme-background), var(--opacity)) !important;
}
</style>
