<template>
  <v-data-table :headers="headers" :items="players" density="compact" class="playertable" items-per-page="-1" no-data-text="No Players found" sort-asc-icon="mdi-chevron-up" sort-desc-icon="mdi-chevron-down">
    <template v-slot:item="{ item }">
      <tr>
        <td class="align-center justify-center">
          <v-tooltip v-for="tag in item.tags" location="bottom">
            <template v-slot:activator="{ props }">
              <v-chip v-bind="props" class="ma-1" size="x-small" :color="tag.color" :prepend-icon="tag.prependIcon" :append-icon="tag.appendIcon">{{ tag.text }}</v-chip>
            </template>
            <span v-if="tag.tooltip !== undefined" style="color: rgba(var(--v-theme-primary))">{{ tag.tooltip }}</span>
          </v-tooltip>
          <v-tooltip v-for="icon in item.icons" location="bottom">
            <template v-slot:activator="{ props }">
              <v-icon v-bind="props" class="ma-1" size="x-small" :color="icon.color">{{ icon.name }}</v-icon>
            </template>
            <span v-if="icon.tooltip !== undefined" style="color: rgba(var(--v-theme-primary))">{{ icon.tooltip }}</span>
          </v-tooltip>
        </td>
        <td>
          <v-tooltip location="bottom">
            <template v-slot:activator="{ props }">
              <span v-bind="props" v-html="parseMCColor(`${item.custom.rankData.shortened.length === 0 ? item.custom.rankData.shortened : item.custom.rankData.shortened + ' '}${item.player.username}`)"></span>
            </template>
            <span v-html="parseMCColor(`${item.custom.rankData.full.length === 0 ? item.custom.rankData.shortened : item.custom.rankData.full + ' '}${item.player.username}`)"></span>
          </v-tooltip>
        </td>
        <td v-for="header in headers.slice(2, -1)">
          <v-tooltip v-if="header.title === 'Level'" location="bottom">
            <template v-slot:activator="{ props }">
              <!-- @vue-skip -->
              <span v-if="GamemodeManager.hypixelMode.value === 'BEDWARS'" v-bind="props" v-html="parseMCColor(parseBedwarsStar(item.player?.stats?.Bedwars?.level || 0).shortened)"></span>
              <!-- @vue-skip -->
              <span v-if="GamemodeManager.hypixelMode.value === 'SKYWARS'" v-bind="props" v-html="parseMCColor(parseSkywarsStar(item.player?.stats?.Skywars?.level || 0).shortened)"></span>
            </template>
            <!-- @vue-skip -->
            <span v-if="GamemodeManager.hypixelMode.value === 'BEDWARS'" v-html="parseMCColor(parseBedwarsStar(item.player?.stats?.Bedwars?.level || 0).full)"></span>
            <!-- @vue-skip -->
            <span v-if="GamemodeManager.hypixelMode.value === 'SKYWARS'" v-html="parseMCColor(parseSkywarsStar(item.player?.stats?.Skywars?.level || 0).full)"></span>
          </v-tooltip>
          <!-- @vue-skip-->
          <span v-if="header.title !== 'Level'" v-html="parseMCColor(parseStat(queryJSONPath(item, `$.${header.key}`, 0), header.stat, GamemodeManager.hypixelMode, GamemodeManager.minigameMode))"></span>
        </td>
        <td>
          <v-menu :close-on-content-click="false" location="end">
            <template v-slot:activator="{ props }">
              <v-btn icon variant="plain" :ripple="false" v-bind="props" style="height: 25px !important">
                <v-icon>mdi-dots-horizontal</v-icon>
              </v-btn>
            </template>
            <v-card min-width="200">
              <v-list density="compact">
                <v-list-item v-if="item.player?.UUID">
                  <v-btn prepend-icon="mdi-chart-timeline-variant-shimmer" size="small" variant="tonal" color="secondary" @click="navigateTo({ path: '/statistics', query: { username: item.player.username, UUID: item.player.UUID } })">Open Statistics</v-btn>
                </v-list-item>
                <v-divider v-if="item.player.username !== dataStore.get('player') && item.player?.UUID && !item?.custom?.blacklistStatus?.reason" class="ma-2"></v-divider>
                <v-list-item v-if="item.player.username !== dataStore.get('player') && item.player?.UUID && !item?.custom?.blacklistStatus?.reason">
                  <v-btn prepend-icon="mdi-account" size="small" variant="tonal" color="warning" @click="BlacklistManager.addEntry(item.player.UUID, 'CHEATING')">Report Player (Cheating)</v-btn>
                </v-list-item>
                <v-list-item v-if="item.player.username !== dataStore.get('player') && item.player?.UUID && !item?.custom?.blacklistStatus?.reason">
                  <v-btn prepend-icon="mdi-account" size="small" variant="tonal" color="warning" @click="BlacklistManager.addEntry(item.player.UUID, 'SNIPING')">Report Player (Sniping)</v-btn>
                </v-list-item>
                <v-divider v-if="item.player.username !== dataStore.get('player') && item.player?.UUID && item?.custom?.blacklistStatus?.reason" class="ma-2"></v-divider>
                <v-list-item v-if="item.player.username !== dataStore.get('player') && item.player?.UUID && item?.custom?.blacklistStatus?.personal">
                  <v-btn prepend-icon="mdi-account" size="small" variant="tonal" color="error" @click="BlacklistManager.removeEntries([item.player.UUID])">Remove Report</v-btn>
                </v-list-item>
                <v-list-item v-if="item.player.username !== dataStore.get('player') && item.player?.UUID && !item?.custom?.blacklistStatus?.personal && item?.custom?.blacklistStatus?.reason">
                  <v-tooltip location="bottom">
                    <template v-slot:activator="{ props }">
                      <span v-bind="props">
                        <v-btn :disabled="true" prepend-icon="mdi-account-cancel" size="small">Remove Report</v-btn>
                      </span>
                    </template>
                    <span style="color: rgba(var(--v-theme-primary))">This Player is blacklisted on another extra Blacklist you've added!</span>
                  </v-tooltip>
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>
        </td>
      </tr>
    </template>
    <template #bottom></template>
  </v-data-table>
</template>

<script setup lang="ts">
import dataStore from "../electron/store";

PlayerManager.addPlayer(dataStore.get("overlaySettings").username);

const hypixelColumns = dataStore.get("columnSettings").columns;
const bedwarsColumns = dataStore.get("columnSettings").bedwarsSettings.columns;
const skywarsColumns = dataStore.get("columnSettings").skywarsSettings.columns;
const duelsColumns = dataStore.get("columnSettings").duelsSettings.columns;
const murderMysteryColumns = dataStore.get("columnSettings").murderMysterySettings.columns;

const defaultHeaders = [
  { title: "Tags", align: "center", key: "tags", sortable: false, width: "20%" },
  { title: "Name", align: "center", key: "player.username", sortable: true, width: "25%" },
];
const headers: Ref<any[]> = ref([...defaultHeaders]);

const updateHeaders = () => {
  headers.value = [...defaultHeaders];

  hypixelColumns.forEach((column) => {
    const header = { ...Constants.overlay.headers.hypixel[column], stat: column };
    header.key = header.key.replace("{MODE}", GamemodeManager.minigameMode.value.toLowerCase());
    headers.value.push(header);
  });

  if (GamemodeManager.hypixelMode.value === "BEDWARS")
    bedwarsColumns.forEach((column) => {
      const header = { ...Constants.overlay.headers.bedwars[column], stat: column };
      header.key = header.key.replace("{MODE}", GamemodeManager.minigameMode.value.toLowerCase());
      headers.value.push(header);
    });

  if (GamemodeManager.hypixelMode.value === "SKYWARS")
    skywarsColumns.forEach((column) => {
      const header = { ...Constants.overlay.headers.skywars[column], stat: column };
      header.key = header.key.replace("{MODE}", GamemodeManager.minigameMode.value.toLowerCase());
      headers.value.push(header);
    });
  if (GamemodeManager.hypixelMode.value === "DUELS")
    duelsColumns.forEach((column) => {
      const header = { ...Constants.overlay.headers.duels[column], stat: column };
      header.key = header.key.replace("{MODE}", GamemodeManager.minigameMode.value.toLowerCase());
      headers.value.push(header);
    });
  if (GamemodeManager.hypixelMode.value === "MURDER_MYSTERY")
    murderMysteryColumns.forEach((column) => {
      const header = { ...Constants.overlay.headers.murderMystery[column], stat: column };
      header.key = header.key.replace("{MODE}", GamemodeManager.minigameMode.value.toLowerCase());
      headers.value.push(header);
    });

  // Empty Row for the management Button
  headers.value.push({ width: "0%" });
};
updateHeaders();

watch([GamemodeManager.hypixelMode, GamemodeManager.minigameMode], () => updateHeaders());

const players = PlayerManager.players;
</script>

<style>
.playertable {
  text-align: center;
  background-color: transparent;
  font-size: 16px;
}

.playertable th {
  height: 30px !important;
}

.playertable tbody tr {
  height: 0px !important;
}

.playertable tbody td {
  height: 0px !important;
}
</style>
