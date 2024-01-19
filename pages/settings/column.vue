<template>
  <v-app>
    <Navigation />
    <NuxtPage />
    <v-container>
      <v-row>
        <v-col>
          <h2>Column Settings</h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card>
            <div class="ml-4 mr-4 mt-4">
              <v-select label="Stats" variant="outlined" color="secondary" :items="colums" prepend-inner-icon="mdi-table-edit" chips multiple v-model="selectedColums" return-object @update:modelValue="setColums"></v-select>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <Notification />
  </v-app>
</template>

<script setup>
import dataStore from "../../electron/store";

const colums = ["WS", "Wins", "WLR", "Finals", "FKDR", "BBLR"];

const selectedColums = ref([]);
selectedColums.value = dataStore.get("colums");

const setColums = (SelectedColums) => {
  dataStore.set("colums", SelectedColums);
  selectedColums.value = dataStore.get("colums");
};
</script>
