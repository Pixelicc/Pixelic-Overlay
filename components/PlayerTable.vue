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
        <td>
          <v-tooltip location="bottom">
            <template v-slot:activator="{ props }">
              <span v-bind="props" v-html="parseMCColor(parseBedwarsStar(item.player?.stats?.Bedwars?.level || 0).shortened)"></span>
            </template>
            <span v-html="parseMCColor(parseBedwarsStar(item.player?.stats?.Bedwars?.level || 0).full)"></span>
          </v-tooltip>
        </td>
        <td v-if="headers.some((h) => h.title === 'WS')"><span v-html="parseMCColor(parseStatColor(item.player?.stats?.Bedwars?.[mode]?.winstreak || 0, 'winstreak', mode))"></span></td>
        <td v-if="headers.some((h) => h.title === 'Wins')"><span v-html="parseMCColor(parseStatColor(item.player?.stats?.Bedwars?.[mode]?.wins || 0, 'wins', mode))"></span></td>
        <td v-if="headers.some((h) => h.title === 'WLR')"><span v-html="parseMCColor(parseStatColor((item.player?.stats?.Bedwars?.[mode]?.WLR || 0).toFixed(2), 'WLR', mode))"></span></td>
        <td v-if="headers.some((h) => h.title === 'Finals')"><span v-html="parseMCColor(parseStatColor(item.player?.stats?.Bedwars?.[mode]?.finalKills || 0, 'finalKills', mode))"></span></td>
        <td v-if="headers.some((h) => h.title === 'FKDR')"><span v-html="parseMCColor(parseStatColor((item.player?.stats?.Bedwars?.[mode]?.FKDR || 0).toFixed(2), 'FKDR', mode))"></span></td>
        <td v-if="headers.some((h) => h.title === 'BBLR')"><span v-html="parseMCColor(parseStatColor((item.player?.stats?.Bedwars?.[mode]?.BBLR || 0).toFixed(2), 'BBLR', mode))"></span></td>
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
                <v-divider v-if="item.player.username !== dataStore.get('player') && item.player?.UUID" class="ma-2"></v-divider>
                <v-list-item v-if="item.player.username !== dataStore.get('player') && item.player?.UUID">
                  <v-btn prepend-icon="mdi-account" size="small" variant="tonal" color="warning" @click="playerHandler.reportPlayer(item.player.UUID, 'CHEATING')">Report Player (Cheating)</v-btn>
                </v-list-item>
                <v-list-item v-if="item.player.username !== dataStore.get('player') && item.player?.UUID">
                  <v-btn prepend-icon="mdi-account" size="small" variant="tonal" color="warning" @click="playerHandler.reportPlayer(item.player.UUID, 'SNIPING')">Report Player (Sniping)</v-btn>
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

const mode = ref("");
mode.value = dataStore.get("mode").toLowerCase();
setInterval(() => {
  mode.value = dataStore.get("mode").toLowerCase();
}, 1000);

playerHandler.addPlayer(dataStore.get("player"));

const headers: globalThis.Ref<any[]> = ref([]);

setInterval(() => {
  const selectedHeaders = dataStore.get("colums");

  headers.value = [
    { title: "Tags", align: "center", key: "tags", sortable: false, width: "20%" },
    { title: "Name", align: "center", key: "player.username", sortable: true, width: "25%" },
    { title: "Level", align: "center", key: "player.stats.Bedwars.level", width: "10%" },
  ];

  if (selectedHeaders.includes("WS")) headers.value.push({ title: "WS", align: "center", key: `player.stats.Bedwars.${mode}.winstreak`, width: "6%" });
  if (selectedHeaders.includes("Wins")) headers.value.push({ title: "Wins", align: "center", key: `player.stats.Bedwars.${mode}.wins`, width: "10%" });
  if (selectedHeaders.includes("WLR")) headers.value.push({ title: "WLR", align: "center", key: `player.stats.Bedwars.${mode}.WLR`, width: "10%" });
  if (selectedHeaders.includes("Finals")) headers.value.push({ title: "Finals", align: "center", key: `player.stats.Bedwars.${mode}.finalKills`, width: "12%" });
  if (selectedHeaders.includes("FKDR")) headers.value.push({ title: "FKDR", align: "center", key: `player.stats.Bedwars.${mode}.FKDR`, width: "10%" });
  if (selectedHeaders.includes("BBLR")) headers.value.push({ title: "BBLR", align: "center", key: `player.stats.Bedwars.${mode}.BBLR`, width: "10%" });

  headers.value.push({ width: "0%" });
}, 1000);

const players: globalThis.Ref<any[]> = ref([]);

setInterval(() => {
  const Players: any[] = [];
  for (const player of playerHandler.getPlayers()) {
    const blacklistStatus = blacklistSystem.getStatus(player.player?.UUID || "");
    Players.push({
      ...player,
      blacklistStatus,
      tags: player.cause === "Invalid UUID" ? [{ text: "NICKED", tooltip: "This Player is hiding their real Name", color: getMCColor("e"), appendIcon: "mdi-incognito" }] : blacklistStatus?.reason ? [{ text: blacklistStatus?.reason === "CHEATING" ? "CHEATER" : "SNIPER", tooltip: "This Player is on one of your Blacklists", color: getMCColor("c"), appendIcon: "mdi-account-alert" }, ...tagSystem.getTags(player.player?.UUID || "")] : tagSystem.getTags(player.player?.UUID || ""),
      custom: {
        rankData: player.cause === "Invalid UUID" ? { full: "§e[NICK]", shortened: "§e" } : parseRank(player.player?.rank || null, player.player?.plusColor || null, player.player?.plusPlusColor || null),
      },
    });
  }
  players.value = Players;
}, 250);
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
