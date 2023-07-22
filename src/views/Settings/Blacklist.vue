<template>
  <v-app>
    <v-container>
      <v-row>
        <v-col>
          <h2>Blacklist Settings</h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card>
            <div class="ml-4 mr-4 mt-4">
              <v-select label="Report Entry Expiry" variant="outlined" :items="expireOptions" prepend-inner-icon="mdi-timer-sand" v-model="getExpiry" return-object @update:modelValue="setExpiry"></v-select>
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

const expireOptions = ["180d", "1y", "3y", "5y", "10y"];

const getExpiry = ref(0);
getExpiry.value = dataStore.get("blacklistExpiry");

const setExpiry = (selectedExpiry) => {
  dataStore.set("blacklistExpiry", selectedExpiry);
  getCogetExpirylums = selectedExpiry;
};
</script>
