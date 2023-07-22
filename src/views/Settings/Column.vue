<template>
  <v-app>
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
              <v-select label="Stats" variant="outlined" :items="colums" prepend-inner-icon="mdi-table-edit" chips multiple v-model="getColums" return-object @update:modelValue="setColums"></v-select>
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

const colums = ["WS", "Wins", "WLR", "Finals", "FKDR", "BBLR"];

const getColums = ref(0);
getColums.value = dataStore.get("colums");

const setColums = (selectedColums) => {
  dataStore.set("colums", selectedColums);
  getColums = selectedColums;
};
</script>
