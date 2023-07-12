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
    <v-data-table v-if="shown" :headers="headers" :items="players" :items-per-page="-1" class="elevation-1" density="compact" no-data-text="No Players found">
      <template v-slot:item="{ item }">
        <tr>
          <td><span v-html="item.columns.username"></span></td>
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

const ipcRenderer = useIpcRenderer();

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
    addPlayer(dataStore.get("player"), true);
  }
};

const turnOffTable = () => {
  shown.value = false;
};

var players = ref(0);
players.value = [];

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
        addPlayer(player.target["_value"], true);
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
    addPlayer(player.target["_value"], true);
  }
};

setInterval(() => {
  const Players = [];
  for (var Player of getPlayers()) {
    if (Player?.cause) {
      if (Player.cause === "Invalid UUID or Username") {
        Players.push({
          username: mcColorParser(`§c[NICKED] ${Player.username}`),
        });
      } else if (Player.cause === "This Player never played Hypixel") {
        Players.push({
          username: mcColorParser(`§c[NO-DATA] ${Player.username}`),
        });
      } else {
        Players.push({
          username: mcColorParser(`§4[FETCHING FAILED] ${Player.username}`),
        });
      }
    } else {
      var tags = "";
      tags += tagsParser(Player.UUID);
      if (dataStore.get("developerMode") === true) {
        tags += " ";
        if (Player.headers["cf-cache-status"] === "HIT") {
          tags += "§a[CF-HIT]";
        } else if (Player.headers["cf-cache-status"] === "MISS") {
          tags += "§4[CF-MISS]";
        } else {
          tags += "§c[CF-EXPIRED]";
        }
        tags += " ";
        if (Player.headers["px-cache-status"] === "HIT") {
          tags += "§a[PX-HIT]";
        } else {
          tags += "§4[PX-MISS]";
        }
      }

      Players.push({
        level: Math.floor(Player.level),
        username: mcColorParser(`${starParser(Math.floor(Player.level))} ${rankParser(Player.rank, Player.plusColor, Player.plusPlusColor)} ${Player.username} ${tags}`),
        WS: Player[dataStore.get("mode").toLowerCase()].winstreak,
        WSFormatted: mcColorParser(statColorParser(Player[dataStore.get("mode").toLowerCase()].winstreak, "WS", dataStore.get("mode").toLowerCase())),
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
      });
    }
  }
  players.value = Players;
}, 250);

var headers = ref(0);

const updateHeaders = () => {
  const selectedHeaders = dataStore.get("colums");

  headers.value = [
    { title: "Name", align: "start", key: "level" },
    { title: "Name", align: "start", key: "username", align: " d-none" },
  ];

  if (selectedHeaders.includes("WS")) headers.value.push({ title: "WS", align: "start", key: "WS", width: "20px" }, { title: "WS", align: "start", key: "WSFormatted", align: " d-none" });
  if (selectedHeaders.includes("Wins")) headers.value.push({ title: "Wins", align: "start", key: "wins" }, { title: "Wins", align: "start", key: "winsFormatted", align: " d-none" });
  if (selectedHeaders.includes("WLR")) headers.value.push({ title: "WLR", align: "start", key: "WLR" }, { title: "WLR", align: "start", key: "WLRFormatted", align: " d-none" });
  if (selectedHeaders.includes("Finals")) headers.value.push({ title: "Finals", align: "start", key: "finalKills" }, { title: "Finals", align: "start", key: "finalKillsFormatted", align: " d-none" });
  if (selectedHeaders.includes("FKDR")) headers.value.push({ title: "FKDR", align: "start", key: "FKDR" }, { title: "FKDR", align: "start", key: "FKDRFormatted", align: " d-none" });
  if (selectedHeaders.includes("BBLR")) headers.value.push({ title: "BBLR", align: "start", key: "BBLR" }, { title: "BBLR", align: "start", key: "BBLRFormatted", align: " d-none" });
};

updateHeaders();

setInterval(() => updateHeaders(), 1000);
</script>
