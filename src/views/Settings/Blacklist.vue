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
          <v-card title="Manage Lists">
            <div class="ml-4 mr-4 mt-4">
              <v-list>
                <v-list-item v-for="blacklist in blacklists">
                  <template v-slot:prepend>
                    <v-icon v-if="blacklist.name === 'Global'">mdi-earth</v-icon>
                    <v-icon v-if="blacklist.name === 'Personal'">mdi-account</v-icon>
                  </template>
                  <template v-slot:append>
                    <v-dialog v-model="clearPersonalBlacklistDialog">
                      <template v-slot:activator="{ props1 }">
                        <v-tooltip text="Clear Personal Blacklist" v-if="blacklist.name === 'Personal'">
                          <template v-slot:activator="{ props2 }">
                            <v-btn variant="flat" icon="mdi-close-box-outline" v-bind="(props1, props2)" @click="clearPersonalBlacklistDialog = true"></v-btn>
                          </template>
                        </v-tooltip>
                      </template>
                      <v-card>
                        <v-card-text>You are about to clear your entire personal blacklist. This can take up to a minute to take affect. Please confirm below.</v-card-text>
                        <v-card-actions class="justify-center">
                          <v-btn color="success" variant="outlined" @click="clearPersonalBlacklist">Confirm</v-btn>
                          <v-btn color="error" variant="outlined" @click="clearPersonalBlacklistDialog = false">Cancel</v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                    <v-checkbox v-model="blacklist.enabled" @update:model-value="toggleList(blacklist.name)" style="display: flex"></v-checkbox>
                  </template>
                  <v-list-item-title>{{ blacklist.name }}</v-list-item-title>
                  <v-list-item-subtitle v-if="blacklist.name === 'Global'">Enabling this might result in false-positives.</v-list-item-subtitle>
                  <v-list-item-subtitle v-if="blacklist.name === 'Personal'">Disabling this list will prevent you from directly seing players you reported!</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </div>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card title="Options">
            <div class="ml-4 mr-4 mt-4">
              <v-select label="Cheater Report Expiry" variant="outlined" :items="cheaterExpireOptions" prepend-inner-icon="mdi-timer-sand" v-model="getCheaterExpiry" return-object @update:modelValue="setCheaterExpiry"></v-select>
              <v-select label="Sniper Report Expiry" variant="outlined" :items="sniperExpireOptions" prepend-inner-icon="mdi-timer-sand" v-model="getSniperExpiry" return-object @update:modelValue="setSniperExpiry"></v-select>
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
import axios from "axios";
import { sendNotification } from "../../misc/snackbarNotification";

const blacklists = ref(0);
blacklists.value = dataStore.get("blacklists");

const toggleList = (name) => {
  dataStore.set("blacklists", blacklists.value);
};

const clearPersonalBlacklistDialog = ref(0);
clearPersonalBlacklistDialog.value = false;

const clearPersonalBlacklist = () => {
  clearPersonalBlacklistDialog.value = false;
  axios
    .delete("https://api.pixelic.de/hypixel/v1/overlay/reportsystem/list/personal", {
      headers: {
        "x-api-key": dataStore.get("pixelicKey"),
      },
      timeout: 10000,
    })
    .then(() =>
      sendNotification({
        timeout: 5000,
        color: "success",
        icon: "mdi-database-sync-outline",
        text: "Your personal blacklist was cleared successfully.",
      })
    )
    .catch(() =>
      sendNotification({
        timeout: 5000,
        color: "error",
        icon: "mdi-database-sync-outline",
        text: "An error occured whilst trying to clear your personal blacklist.",
      })
    );
};

const cheaterExpireOptions = ["7d", "30d", "90d", "180d", "1y", "3y", "5y", "10y"];

const getCheaterExpiry = ref(0);
getCheaterExpiry.value = dataStore.get("blacklistCheaterExpiry");

const setCheaterExpiry = (selectedExpiry) => {
  dataStore.set("blacklistCheaterExpiry", selectedExpiry);
  getCheaterExpiry.value = selectedExpiry;
};

const sniperExpireOptions = ["7d", "30d", "90d", "180d", "1y", "3y", "5y", "10y"];

const getSniperExpiry = ref(0);
getSniperExpiry.value = dataStore.get("blacklistSniperExpiry");

const setSniperExpiry = (selectedExpiry) => {
  dataStore.set("blacklistSniperExpiry", selectedExpiry);
  getSniperExpiry.value = selectedExpiry;
};
</script>
