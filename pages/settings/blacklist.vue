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
                      <v-icon color="secondary">mdi-delete</v-icon>
                    </v-btn>
                    <v-dialog v-if="blacklist?.type === 'PERSONAL'" v-model="editPersonalBlacklistDialog">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          icon
                          variant="text"
                          color="secondary"
                          v-bind="props"
                          @click="
                            editPersonalBlacklistDialogLoadPersonalBlacklist();
                            editPersonalBlacklistDialog = true;
                          ">
                          <v-icon>mdi-pencil</v-icon></v-btn
                        >
                      </template>
                      <v-container>
                        <v-row>
                          <v-col>
                            <v-card title="Edit Blacklist">
                              <div class="ml-4 mr-4 mt-4">
                                <v-data-table-virtual :headers="editPersonalBlacklistDialogHeaders" :items="editPersonalBlacklistDialogItems" v-model="editPersonalBlacklistDialogSelectedItems" item-value="UUID" show-select class="edittable" height="475"> </v-data-table-virtual>
                                <v-card-actions class="justify-center">
                                  <v-btn variant="outlined" prepend-icon="mdi-delete" color="error" @click="editPersonalBlacklistDialogDeleteSelection">Delete Selection</v-btn>
                                  <v-btn variant="outlined" prepend-icon="mdi-cancel" color="warning" @click="editPersonalBlacklistDialog = false">Cancel</v-btn>
                                </v-card-actions>
                              </div>
                            </v-card>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-dialog>
                    <v-checkbox v-model="blacklist.enabled" color="secondary" @update:model-value="saveBlacklists()" style="display: flex"></v-checkbox>
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
                  <v-btn variant="outlined" color="secondary" v-bind="props" @click="addBlacklistDialog = true">Add Blacklist</v-btn>
                </template>
                <v-container>
                  <v-row>
                    <v-col>
                      <v-card title="Paste Blacklist ID">
                        <div class="ml-4 mr-4 mt-4">
                          <v-text-field :rules="[validateBlacklistID]" variant="outlined" color="secondary" label="Blacklist ID" prepend-icon="mdi-content-paste" clearable v-model="addBlacklistQuery" @keydown.enter.prevent:model-value="addBlacklist"></v-text-field>
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
    <Notification />
  </v-app>
</template>

<script setup lang="ts">
import moment from "moment";
import dataStore from "../../electron/store";

type Blacklist = { enabled: boolean; type?: string; ID: string };

const validateBlacklistID = async (ID: string) => {
  if (!validateHexID(ID, 10)) return false;
  const { data, error } = await useFetch(`${getAPIInstance()}/v2/pixelic-overlay/blacklist/${ID}`, {
    key: `Blacklist:${ID}`,
    headers: {
      "X-API-Key": dataStore.get("APIKey"),
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

const editPersonalBlacklistDialog = ref(false);

const editPersonalBlacklistDialogHeaders: globalThis.Ref<any[]> = ref([]);
editPersonalBlacklistDialogHeaders.value = [
  { title: "UUID", align: "center", key: "UUID" },
  { title: "Reason", align: "center", key: "reason" },
  { title: "Time added", align: "center", key: "timestamp" },
];

const editPersonalBlacklistDialogItems: globalThis.Ref<any[]> = ref([]);

const editPersonalBlacklistDialogSelectedItems: globalThis.Ref<any[]> = ref([]);

const editPersonalBlacklistDialogLoadPersonalBlacklist = async () => {
  await blacklistSystem.updatePersonalBlacklist();
  editPersonalBlacklistDialogItems.value = Object.entries(blacklistSystem.getPersonalBlacklist()).map(([UUID, obj]) => ({ UUID, ...{ reason: obj.reason, timestamp: moment(obj.timestamp * 1000).fromNow() } }));
};

const editPersonalBlacklistDialogDeleteSelection = async () => {
  await blacklistSystem.removeEntries(editPersonalBlacklistDialogSelectedItems.value);
  editPersonalBlacklistDialog.value = false;
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

<style>
.edittable {
  text-align: center;
  background-color: transparent;
  font-size: 16px;
}

.edittable th {
  height: 30px !important;
}

.edittable tbody tr {
  height: 0px !important;
}

.edittable tbody td {
  height: 0px !important;
}
</style>
