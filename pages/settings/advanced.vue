<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>Advanced Settings</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card title="API Servers/Instances">
          <v-card-text class="mt-4">
            <div>
              <div class="ml-12" style="font-style: italic; color: rgb(var(--v-theme-warning))">Providing a custom Pixelic-API Instance will reroute all API calls to your own hosted API Instance. This Feature will initally break a lot of Features due to missing Data on your API Instance. This also breaks all kinds of sharing between Users that do not use your Pixelic-API Instance aswell.</div>
              <v-text-field class="mt-4" :rules="[validateURL]" variant="outlined" color="secondary" clearable label="Custom Pixelic-API Instance URL" persistent-placeholder placeholder="https://api.pixelic.de" prepend-icon="mdi-cloud-download" v-model="customInstance" @update:model-value="setCustomInstance"></v-text-field>
            </div>
            <v-divider :thickness="8" class="border-opacity-0"></v-divider>
            <div>
              <div class="ml-12" style="font-style: italic; color: rgb(var(--v-theme-warning))">3rd Party Translation Servers are not managed by Mojang and may be less secure but provide higher troughput trough utilizing caching and other methods. If you want to use your own Translation Server, select Custom, enter the URL and fillout the paths.</div>
              <v-select class="mt-2" label="UUID/Username Translation Servers" variant="outlined" color="secondary" :items="availableTranslationServers" v-model="selectedTranslationServers" multiple chips prepend-icon="mdi-cloud-upload" @update:model-value="setTranslationServers"></v-select>
              <v-card v-if="selectedTranslationServers.some((server) => server.props.ID === 'CUSTOM')" class="ml-8" title="Custom Translation Server" elevation="0">
                <v-card-text class="mt-4">
                  <div class="ml-1" style="font-style: italic; color: rgb(var(--v-theme-warning))">Custom Translation URL are required to include placeholders like {USERNAME} and {UUID} so the code can replace them with the requested Username or UUID.</div>
                  <v-text-field class="mt-2" :rules="[validateURL, validateUsernamePlaceholder]" variant="outlined" color="secondary" clearable label="UUID Translation URL" persistent-placeholder placeholder="http://localhost/uuid/{USERNAME}" v-model="customTranslationServer.URLs.UUID" @update:model-value="setCustomTranslationServerSettings"></v-text-field>
                  <v-text-field :rules="[validateURL, validateUUIDPlaceholder]" variant="outlined" color="secondary" clearable label="Username Translation URL" persistent-placeholder placeholder="http://localhost/username/{UUID}" v-model="customTranslationServer.URLs.username" @update:model-value="setCustomTranslationServerSettings"></v-text-field>
                  <div class="ml-1" style="font-style: italic; color: rgb(var(--v-theme-warning))">Custom Translation Servers NEED to return valid JSON that can be parsed. (A JSONPath Expressions needs to begin with the dollar sign ( $ ), which represents the root element)</div>
                  <v-text-field class="mt-2" :rules="[validateJSONPath]" variant="outlined" color="secondary" clearable label="UUID JSONPath Expression" persistent-placeholder placeholder="$.player.uuid" v-model="customTranslationServer.paths.UUID" @update:model-value="setCustomTranslationServerSettings"></v-text-field>
                  <v-text-field :rules="[validateJSONPath]" variant="outlined" color="secondary" clearable label="Username JSONPath Expression" persistent-placeholder placeholder="$.player.username" v-model="customTranslationServer.paths.username" @update:model-value="setCustomTranslationServerSettings"></v-text-field>
                </v-card-text>
              </v-card>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import dataStore from "../../electron/store";

const customInstance = ref(dataStore.get("APISettings").customInstanceSettings.baseURL);
const setCustomInstance = () => {
  if (validateURL(customInstance.value)) {
    dataStore.set("APISettings.customInstanceSettings.baseURL", customInstance.value);
  }
};

const availableTranslationServers: globalThis.Ref<any[]> = ref([]);
availableTranslationServers.value = [];
for (const server of Object.values(Constants.overlay.translationServers)) {
  availableTranslationServers.value.push(server);
}

const selectedTranslationServers: globalThis.Ref<any[]> = ref([]);
selectedTranslationServers.value = [];
for (const ID of dataStore.get("APISettings").translationServers) {
  // @ts-ignore
  selectedTranslationServers.value.push(Constants.overlay.translationServers[ID]);
}

const setTranslationServers = () => {
  const servers = [];
  for (const server of selectedTranslationServers.value) {
    servers.push(server.props.ID);
  }
  dataStore.set("translationServers", servers);
};

const customTranslationServer = ref(dataStore.get("APISettings").customTranslationServerSettings);

const setCustomTranslationServerSettings = () => {
  if (validateURL(customTranslationServer.value.URLs.UUID) && validateUsernamePlaceholder(customTranslationServer.value.URLs.UUID)) {
    dataStore.set("customTranslationServer.URLs.UUID", customTranslationServer.value.URLs.UUID);
  }
  if (validateURL(customTranslationServer.value.URLs.username) && validateUUIDPlaceholder(customTranslationServer.value.URLs.username)) {
    dataStore.set("customTranslationServer.URLs.username", customTranslationServer.value.URLs.username);
  }
  if (validateJSONPath(customTranslationServer.value.paths.UUID)) {
    dataStore.set("customTranslationServer.paths.UUID", customTranslationServer.value.paths.UUID);
  }
  if (validateJSONPath(customTranslationServer.value.paths.username)) {
    dataStore.set("customTranslationServer.paths.username", customTranslationServer.value.paths.username);
  }
};

const validateUUIDPlaceholder = (str: string) => {
  return str.includes("{UUID}");
};
const validateUsernamePlaceholder = (str: string) => {
  return str.includes("{USERNAME}");
};
</script>
