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
                    <v-dialog v-if="blacklist.name === 'Personal' && personalBlacklist.length !== 0" v-model="editPersonalBlacklistDialog">
                      <template v-slot:activator="{ props }">
                        <v-btn variant="flat" icon="mdi-pencil" v-bind="props" @click="editPersonalBlacklistDialog = true"></v-btn>
                      </template>
                      <v-card title="Manage Reports">
                        <div class="ml-4 mr-4 mt-4 mb-4">
                          <v-text-field v-model="personalBlacklistSearch" class="ml-2" variant="outlined" density="compact" single-line hide-details prepend-inner-icon="mdi-account-search" persistent-placeholder placeholder="Search player(s)"></v-text-field>
                          <v-data-table show-select item-value="UUID" v-model="personalBlacklistSelection" :loading="loadingPersonalBlacklist" :search="personalBlacklistSearch" :headers="personalBlacklistHeaders" :items="personalBlacklist" itemsPerPageText="Reports per page" itemsPerPage="10"> </v-data-table>
                        </div>
                        <v-card-actions class="justify-center">
                          <v-btn prepend-icon="mdi-delete" color="warning" variant="outlined" @click="clearPersonalBlacklistSelection">Delete Selection</v-btn>
                          <v-btn prepend-icon="mdi-cancel" color="error" variant="outlined" @click="editPersonalBlacklistDialog = false">Cancel</v-btn>
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
import moment from "moment";
import { sendNotification } from "../../misc/snackbarNotification";

moment.relativeTimeThreshold("M", 12);
moment.relativeTimeThreshold("w", 4);
moment.relativeTimeThreshold("d", 7);
moment.relativeTimeThreshold("h", 24);

const blacklists = ref(0);
blacklists.value = dataStore.get("blacklists");

const toggleList = (name) => {
  dataStore.set("blacklists", blacklists.value);
};

const personalBlacklist = ref(0);
const personalBlacklistSearch = ref(0);
personalBlacklistSearch.value = "";

const editPersonalBlacklistDialog = ref(0);
editPersonalBlacklistDialog.value = false;

const loadingPersonalBlacklist = ref(0);
loadingPersonalBlacklist.value = true;

const updatePersonalBlacklist = () => {
  loadingPersonalBlacklist.value = true;
  axios
    .get("https://api.pixelic.de/hypixel/v1/overlay/reportsystem/list/personal", { params: { extended: "true" }, headers: { "X-API-Key": dataStore.get("pixelicKey"), "cache-control": "no-cache" } })
    .then(async (res) => {
      const rawList = res.data.reports;
      const parsedList = [];
      const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
      for (const report of rawList) {
        parsedList.push({ ...report, reason: capitalize(report.reason), timestampExpiry: moment(report.timestampExpiry * 1000).fromNow() });
      }
      personalBlacklist.value = parsedList;
      loadingPersonalBlacklist.value = false;
    })
    .catch(() => {
      personalBlacklist.value = [];
      loadingPersonalBlacklist.value = false;
    });
};
updatePersonalBlacklist();

const personalBlacklistHeaders = [
  { title: "Username", align: "center", key: "username" },
  { title: "UUID", align: "center", key: "UUID" },
  { title: "Expiring", align: "center", key: "timestampExpiry" },
  { title: "Reason", align: "center", key: "reason" },
];

var personalBlacklistSelection = ref(0);
personalBlacklistSelection.value = [];

const clearPersonalBlacklistSelection = () => {
  editPersonalBlacklistDialog.value = false;

  if (personalBlacklistSelection.value.length !== 0) {
    axios
      .delete("https://api.pixelic.de/hypixel/v1/overlay/reportsystem/reports", {
        params: {
          UUIDs: personalBlacklistSelection.value.join(","),
        },
        headers: {
          "X-API-Key": dataStore.get("pixelicKey"),
        },
        timeout: 10000,
      })
      .then(() => {
        sendNotification({
          timeout: 5000,
          color: "success",
          icon: "mdi-database-sync-outline",
          text: "Your selected reports from your personal blacklist were deleted successfully.",
        });
        updatePersonalBlacklist();
      })
      .catch(() =>
        sendNotification({
          timeout: 5000,
          color: "error",
          icon: "mdi-database-sync-outline",
          text: "An error occured whilst trying to delete your selected reports from your personal blacklist.",
        })
      );
    personalBlacklistSelection.value = [];
  }
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
