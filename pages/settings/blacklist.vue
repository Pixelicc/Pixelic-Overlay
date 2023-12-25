<template>
  <v-app>
    <Navigation />
    <NuxtPage />
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
              <v-list density="compact">
                <v-list-item v-for="blacklist in blacklists">
                  <template v-slot:prepend>
                    <v-icon v-if="blacklist?.type !== 'PERSONAL'">mdi-format-list-checkbox</v-icon>
                    <v-icon v-if="blacklist?.type === 'PERSONAL'">mdi-account</v-icon>
                  </template>
                  <template v-slot:append>
                    <v-btn v-if="blacklist?.type !== 'PERSONAL'" icon variant="text" @click="removeBlacklist(blacklist)" style="display: flex">
                      <v-icon color="primary">mdi-delete</v-icon>
                    </v-btn>
                    <v-checkbox v-model="blacklist.enabled" color="primary" @update:model-value="saveBlacklists()" style="display: flex"></v-checkbox>
                  </template>
                  <v-list-item-title v-if="blacklist?.type !== 'PERSONAL'">ID: {{ blacklist.ID }}</v-list-item-title>
                  <v-list-item-title v-if="blacklist?.type === 'PERSONAL'">Personal Blacklist</v-list-item-title>
                  <v-list-item-subtitle v-if="blacklist?.type === 'PERSONAL'">Disabling this list will prevent you from directly seing players you reported!</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </div>
            <div class="ma-4">
              <v-dialog v-model="addBlacklistDialog">
                <template v-slot:activator="{ props }">
                  <v-btn variant="outlined" color="primary" v-bind="props" @click="addBlacklistDialog = true">Add Blacklist</v-btn>
                </template>
                <v-container>
                  <v-row>
                    <v-col>
                      <v-card title="Paste Blacklist ID">
                        <div class="ml-4 mr-4 mt-4">
                          <v-text-field :rules="[validateBlacklistID]" variant="outlined" color="primary" label="Blacklist ID" prepend-icon="mdi-content-paste" clearable v-model="addBlacklistQuery" @keydown.enter.prevent:model-value="addBlacklist"></v-text-field>
                        </div>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-container>
              </v-dialog>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script setup lang="ts">
import dataStore from "../../electron/store";

type Blacklist = { enabled: boolean; type?: string; ID: string };

const validateBlacklistID = async (ID: string) => {
  if (!validateHexID(ID, 10)) return false;
  const { data, error } = await useFetch(`https://api.pixelic.de/v2/pixelic-overlay/blacklist/${ID}`, {
    key: `Blacklist:${ID}`,
    headers: {
      "X-API-Key": dataStore.get("pixelicKey"),
    },
  });
  if (error.value) return false;
  return (data.value as any).success;
};

const blacklists: globalThis.Ref<Blacklist[]> = ref([]);

const updateBlacklists = () => {
  blacklists.value = dataStore.get("blacklists");
};
updateBlacklists();

const saveBlacklists = () => {
  dataStore.set("blacklists", blacklists.value);
};

const addBlacklistDialog = ref(false);
const addBlacklistQuery = ref("");

const addBlacklist = async () => {
  if (await validateBlacklistID(addBlacklistQuery.value)) {
    const copy = [...blacklists.value];
    copy.push({ enabled: true, ID: addBlacklistQuery.value });
    blacklists.value = [...new Map(copy.map((blacklist) => [blacklist.ID, blacklist])).values()];
    saveBlacklists();
    addBlacklistDialog.value = false;
    addBlacklistQuery.value = "";
  }
};

const removeBlacklist = (blacklist: Blacklist) => {
  if (blacklist?.type !== "PERSONAL") {
    blacklists.value = blacklists.value.filter((bl) => bl.ID !== blacklist.ID);
    saveBlacklists();
  }
};
</script>
