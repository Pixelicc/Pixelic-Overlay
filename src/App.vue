<template>
  <v-app>
    <v-toolbar color="transparent" density="compact" style="-webkit-app-region: drag">
      <v-app-bar-nav-icon></v-app-bar-nav-icon>

      <v-toolbar-title class="grow">Pixelic Overlay</v-toolbar-title>

      <router-link to="/" class="v-btn" @click="turnOnTable">
        <v-btn icon style="-webkit-app-region: no-drag">
          <v-icon color="primary">mdi-table</v-icon>
        </v-btn></router-link
      >

      <router-link to="/statistics" class="v-btn" @click="turnOffTable">
        <v-btn icon style="-webkit-app-region: no-drag">
          <v-icon color="primary">mdi-chart-line</v-icon>
        </v-btn></router-link
      >

      <router-link to="/settings" class="v-btn" @click="turnOffTable">
        <v-btn icon style="-webkit-app-region: no-drag">
          <v-icon color="primary">mdi-settings</v-icon>
        </v-btn></router-link
      >

      <v-btn icon @click="refreshPlayers" style="-webkit-app-region: no-drag">
        <v-icon color="secondary">mdi-refresh</v-icon>
      </v-btn>

      <v-btn icon @click="clear" style="-webkit-app-region: no-drag">
        <v-icon color="secondary">mdi-account-multiple-minus</v-icon>
      </v-btn>

      <v-text-field solo dense single-line hide-details prepend-inner-icon="mdi-account-search" persistent-placeholder placeholder="Search player(s)" v-model="searchQuery" @keydown.enter.prevent:modelValue="forceAddPlayer" :error-messages="searchErrors" style="-webkit-app-region: no-drag"></v-text-field>

      <v-btn icon @click="minimizeWindow" style="-webkit-app-region: no-drag">
        <v-icon>mdi-minus</v-icon>
      </v-btn>

      <v-btn icon @click="closeWindow" style="-webkit-app-region: no-drag">
        <v-icon>mdi-window-close</v-icon>
      </v-btn>
    </v-toolbar>
    <router-view></router-view>
    <v-data-table v-if="shown" :headers="headers" :items="players" :items-per-page="-1" class="datatable elevation-1" density="compact" no-data-text="No Players found" sort-asc-icon="mdi-chevron-up" sort-desc-icon="mdi-chevron-down">
      <template v-slot:item="{ item }">
        <tr>
          <td class="align-center justify-center">
            <v-tooltip v-for="tag in item.columns.tags" location="bottom">
              <template v-slot:activator="{ props }">
                <v-chip v-bind="props" class="ma-1" size="x-small" :color="tag.color" :prepend-icon="tag.prependIcon" :append-icon="tag.appendIcon">{{ tag.text }}</v-chip>
              </template>
              <span style="color: rgba(var(--v-theme-primary))">{{ tag.tooltip }}</span>
            </v-tooltip>
            <v-tooltip v-for="icon in item.columns.icons" location="bottom">
              <template v-slot:activator="{ props }">
                <v-icon v-bind="props" class="ma-1" size="x-small" :color="icon.color">{{ icon.name }}</v-icon>
              </template>
              <span style="color: rgba(var(--v-theme-primary))">{{ icon.tooltip }}</span>
            </v-tooltip>
          </td>
          <td>
            <v-tooltip location="bottom">
              <template v-slot:activator="{ props }">
                <span v-bind="props" v-html="item.columns.levelFormatted"></span>
              </template>
              <span v-html="item.columns.fullLevel"></span>
            </v-tooltip>
          </td>
          <td>
            <v-tooltip location="bottom">
              <template v-slot:activator="{ props }">
                <span v-bind="props" v-html="item.columns.username"></span>
              </template>
              <span v-html="item.columns.fullUsername"></span>
            </v-tooltip>
          </td>
          <td v-if="headers.some((h) => h.title === 'WS')"><span v-html="item.columns.WSFormatted"></span></td>
          <td v-if="headers.some((h) => h.title === 'Wins')"><span v-html="item.columns.winsFormatted"></span></td>
          <td v-if="headers.some((h) => h.title === 'WLR')"><span v-html="item.columns.WLRFormatted"></span></td>
          <td v-if="headers.some((h) => h.title === 'Finals')"><span v-html="item.columns.finalKillsFormatted"></span></td>
          <td v-if="headers.some((h) => h.title === 'FKDR')"><span v-html="item.columns.FKDRFormatted"></span></td>
          <td v-if="headers.some((h) => h.title === 'BBLR')"><span v-html="item.columns.BBLRFormatted"></span></td>
        </tr>
      </template>
      <template #bottom></template>
    </v-data-table>
  </v-app>
</template>

<script setup>
import "../app.css";
import { useIpcRenderer } from "@vueuse/electron";
import dataStore from "./data/dataStore";
import { parseMessage, getPlayers, addPlayer, refreshPlayers, clear } from "./misc/overlay";
import { ref } from "vue";
import mcColorParser from "./misc/mcColorParser";
import rankParser from "./misc/rankParser";
import starParser from "./misc/starParser";
import tagsParser from "./misc/tagsParser";
import statColorParser from "./misc/statColorParser";
import router from "./router";

const ipcRenderer = useIpcRenderer();

if (dataStore.get("pixelicKey") === "") {
  router.push("/settings");
  ipcRenderer.send("discordAuth");
}

ipcRenderer.send("windowEvent", dataStore.get("windowLocation"));

ipcRenderer.send("logPath", [dataStore.get("client"), dataStore.get("customLogFilePath")]);
if (dataStore.get("developerMode") === true) ipcRenderer.send("devTools", true);
ipcRenderer.send("discordRPC-set", dataStore.get("discordRPC"));
if (dataStore.get("player") !== "" && dataStore.get("pixelicKey") !== "" && dataStore.get("discordRPC") === true) ipcRenderer.send("discordRPC-init", [dataStore.get("player"), dataStore.get("pixelicKey")]);

var shown = ref(0);
shown.value = true;

const turnOnTable = () => {
  shown.value = true;
  if (dataStore.get("player") !== "" && dataStore.get("pixelicKey") !== "") {
    addPlayer(dataStore.get("player"), { forced: true });
  }
};

const turnOffTable = () => {
  shown.value = false;
};

var players = ref(0);
players.value = [];

addPlayer(dataStore.get("player"), { forced: true });

ipcRenderer.on("mcLog", (event, msg) => {
  parseMessage(msg);
});

ipcRenderer.on("windowLocation", (event, msg) => {
  dataStore.set("windowLocation", msg);
});

const minimizeWindow = () => {
  ipcRenderer.send("windowEvent", "minimizeWindow");
};
const closeWindow = () => {
  ipcRenderer.send("windowEvent", "closeWindow");
};

const searchQuery = ref(0);
searchQuery.value = "";

const searchErrors = ref(0);
searchErrors.value = [];

const forceAddPlayer = (player) => {
  searchQuery.value = "";

  if (player.target["_value"] === "" || player.target["_value"] === undefined) {
    searchErrors.value = [];
    ipcRenderer.send("viewStatistics", dataStore.get("player"));
    return;
  }

  if (!/^[a-zA-Z0-9_]{2,16}$/gm.test(player.target["_value"])) {
    player.target["_value"] = player.target["_value"].replace(/-/g, "");
    if (player.target["_value"].length !== 32) {
      searchErrors.value = ["Invalid Hypixel UUID"];
      return;
    }
    if (/[0-9a-fA-F]{12}4[0-9a-fA-F]{19}/.test(player.target["_value"])) {
      searchErrors.value = [];
      if (shown.value === false) {
        ipcRenderer.send("viewStatistics", dataStore.get("player"));
      } else {
        addPlayer(player.target["_value"], { forced: true });
      }
    } else {
      searchErrors.value = ["Invalid Hypixel Username"];
      return;
    }
  }
  searchErrors.value = [];
  if (shown.value === false) {
    ipcRenderer.send("viewStatistics", player.target["_value"]);
  } else {
    addPlayer(player.target["_value"], { forced: true });
  }
};

setInterval(() => {
  const Players = [];
  for (var Player of getPlayers()) {
    if (Player?.cause) {
      if (Player.cause.toLowerCase() === "invalid uuid or username") {
        Players.push({
          username: mcColorParser(`§c${Player.username}`),
          tags: [{ text: "NICKED", tooltip: "This player is hiding their name!", color: "red-lighten-1" }],
        });
      } else if (Player.cause.toLowerCase() === "this player never played hypixel") {
        Players.push({
          username: mcColorParser(`§c${Player.username}`),
          tags: [{ text: "NO-DATA", tooltip: "This player never played on Hypixel!", color: "red-lighten-1" }],
        });
      } else if (Player.cause.toLowerCase() === "invalid api-key") {
        Players.push({
          username: mcColorParser(`§c${Player.username}`),
          tags: [{ text: "INVALID API-KEY", tooltip: "You are using an invalid API-Key!", color: "red-lighten-1" }],
        });
      } else {
        Players.push({
          username: mcColorParser(`§4${Player.username}`),
          tags: [{ text: "FETCHING-FAILED", tooltip: "Some error occured while fetching!", color: "red-lighten-1" }],
        });
      }
    } else {
      var tags = [...tagsParser(Player.UUID)];
      if (dataStore.get("developerMode") === true) {
        if (Player.headers["cf-cache-status"] === "HIT") {
          tags.push({ text: "CF", tooltip: "CF-Cache-HIT", color: "green-lighten-1" });
        } else if (Player.headers["cf-cache-status"] === "MISS") {
          tags.push({ text: "CF", tooltip: "CF-Cache-MISS", color: "red-lighten-1" });
        } else {
          tags.push({ text: "CF", tooltip: "CF-Cache-EXPIRED", color: "orange-lighten-2" });
        }
        if (Player.headers["px-cache-status"] === "HIT") {
          tags.push({ text: "PX", tooltip: "PX-Cache-HIT", color: "green-lighten-1" });
        } else {
          tags.push({ text: "PX", tooltip: "PX-Cache-MISS", color: "red-lighten-1" });
        }
      }

      Players.push({
        fullUsername: mcColorParser(`${rankParser(Player.rank, Player.plusColor, Player.plusPlusColor)[0]} ${Player.username}`),
        username: mcColorParser(`${rankParser(Player.rank, Player.plusColor, Player.plusPlusColor)[1]} ${Player.username}`),
        level: Math.floor(Player.level),
        fullLevel: mcColorParser(starParser(Math.floor(Player.level))[0]),
        levelFormatted: mcColorParser(starParser(Math.floor(Player.level))[1]),
        WS: Player[dataStore.get("mode").toLowerCase()].winstreak,
        WSFormatted: mcColorParser(Player.APISettings.winstreaksHidden ? "§c?" : statColorParser(Player[dataStore.get("mode").toLowerCase()].winstreak, "WS", dataStore.get("mode").toLowerCase())),
        wins: Player[dataStore.get("mode").toLowerCase()].wins,
        winsFormatted: mcColorParser(statColorParser(Player[dataStore.get("mode").toLowerCase()].wins, "wins")),
        WLR: Player[dataStore.get("mode").toLowerCase()].WLR.toFixed(2),
        WLRFormatted: mcColorParser(statColorParser(Player[dataStore.get("mode").toLowerCase()].WLR.toFixed(2), "WLR")),
        finalKills: Player[dataStore.get("mode").toLowerCase()].finalKills,
        finalKillsFormatted: mcColorParser(statColorParser(Player[dataStore.get("mode").toLowerCase()].finalKills, "finalKills")),
        FKDR: Player[dataStore.get("mode").toLowerCase()].FKDR.toFixed(2),
        FKDRFormatted: mcColorParser(statColorParser(Player[dataStore.get("mode").toLowerCase()].FKDR.toFixed(2), "FKDR")),
        BBLR: Player[dataStore.get("mode").toLowerCase()].BBLR.toFixed(2),
        BBLRFormatted: mcColorParser(statColorParser(Player[dataStore.get("mode").toLowerCase()].BBLR.toFixed(2), "BBLR")),
        tags: tags,
        icons: Player.icons,
      });
    }
  }
  players.value = Players;
}, 250);

var headers = ref(0);

const updateHeaders = () => {
  const selectedHeaders = dataStore.get("colums");

  // TODO: Dynamically adjust header width //

  headers.value = [
    { title: "Tags", align: "center", key: "tags", sortable: false, width: "20%" },
    { key: "icons", align: " d-none" },
    { title: "Level", align: "center", key: "level", width: "10%" },
    { key: "levelFormatted", align: " d-none" },
    { key: "fullLevel", align: " d-none" },
    { title: "Name", align: "center", key: "username", sortable: false, width: "25%" },
    { key: "fullUsername", align: " d-none" },
  ];

  if (selectedHeaders.includes("WS")) headers.value.push({ title: "WS", align: "center", key: "WS", width: "8%" }, { key: "WSFormatted", align: " d-none" });
  if (selectedHeaders.includes("Wins")) headers.value.push({ title: "Wins", align: "center", key: "wins", width: "10%" }, { key: "winsFormatted", align: " d-none" });
  if (selectedHeaders.includes("WLR")) headers.value.push({ title: "WLR", align: "center", key: "WLR", width: "10%" }, { key: "WLRFormatted", align: " d-none" });
  if (selectedHeaders.includes("Finals")) headers.value.push({ title: "Finals", align: "center", key: "finalKills", width: "12%" }, { title: "Finals", key: "finalKillsFormatted", align: " d-none" });
  if (selectedHeaders.includes("FKDR")) headers.value.push({ title: "FKDR", align: "center", key: "FKDR", width: "10%" }, { key: "FKDRFormatted", align: " d-none" });
  if (selectedHeaders.includes("BBLR")) headers.value.push({ title: "BBLR", align: "center", key: "BBLR", width: "10%" }, { key: "BBLRFormatted", align: " d-none" });
};

updateHeaders();

setInterval(() => updateHeaders(), 1000);
</script>

<style>
.datatable table {
  text-align: center;
  table-layout: fixed;
}
.datatable thead th {
  font-size: 12px !important;
}
.v-data-table .v-table__wrapper > table > thead > tr > th:not(.v-data-table__th--sorted) .v-data-table-header__sort-icon,
.v-data-table .v-table__wrapper > table tbody > tr > th:not(.v-data-table__th--sorted) .v-data-table-header__sort-icon {
  width: 0;
}
.v-data-table .v-table__wrapper > table > thead > tr > th:not(.v-data-table__th--sorted):hover .v-data-table-header__sort-icon,
.v-data-table .v-table__wrapper > table tbody > tr > th:not(.v-data-table__th--sorted):hover .v-data-table-header__sort-icon {
  opacity: 0 !important;
}
</style>
