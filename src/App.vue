<template>
  <v-app>
    <v-toolbar density="compact" style="-webkit-app-region: drag; background-color: rgba(var(--v-theme-background), var(--opacity)) !important">
      <v-app-bar-nav-icon variant="text" @click.stop="sidebar = !sidebar" style="-webkit-app-region: no-drag"></v-app-bar-nav-icon>

      <v-toolbar-title v-if="!sidebar" class="grow"> Pixelic Overlay </v-toolbar-title>
      <v-toolbar-title v-if="sidebar" class="grow" style="-webkit-app-region: no-drag"> Pixelic Overlay </v-toolbar-title>

      <v-btn v-if="table" icon @click="refreshPlayers" style="-webkit-app-region: no-drag">
        <v-icon color="secondary">mdi-refresh</v-icon>
      </v-btn>

      <v-btn v-if="table" icon @click="clear" style="-webkit-app-region: no-drag">
        <v-icon color="secondary">mdi-account-multiple-minus</v-icon>
      </v-btn>

      <v-text-field v-if="table || route.path === '/statistics'" class="ml-2" variant="outlined" density="compact" single-line hide-details prepend-inner-icon="mdi-account-search" persistent-placeholder placeholder="Search player(s)" v-model="searchQuery" @keydown.enter.prevent:modelValue="forceAddPlayer" :error-messages="searchErrors" style="-webkit-app-region: no-drag; max-width: 25%"></v-text-field>

      <v-btn icon @click="minimizeWindow" style="-webkit-app-region: no-drag">
        <v-icon>mdi-minus</v-icon>
      </v-btn>

      <v-btn icon @click="closeWindow" style="-webkit-app-region: no-drag">
        <v-icon>mdi-window-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-navigation-drawer temporary v-model="sidebar">
      <v-list nav>
        <v-list-item prepend-icon="mdi-table" title="Overlay" value="overlay" router-link to="/" @click="turnOnTable"></v-list-item>
        <v-list-item prepend-icon="mdi-chart-line" title="Statistics" value="statistics" router-link to="/statistics" @click="turnOffTable"></v-list-item>
        <v-divider :thickness="8" class="border-opacity-0"></v-divider>
        <v-divider></v-divider>
        <v-divider :thickness="8" class="border-opacity-0"></v-divider>
        <v-list-item prepend-icon="mdi-application-outline" title="Basic Settings" value="basic-settings" router-link to="/basic-settings" @click="turnOffTable"></v-list-item>
        <v-list-item prepend-icon="mdi-format-list-bulleted" title="Blacklist Settings" value="blacklist-settings" router-link to="/blacklist-settings" @click="turnOffTable"></v-list-item>
        <v-list-item prepend-icon="mdi-palette-outline" title="Appearance Settings" value="appearance-settings" router-link to="/appearance-settings" @click="turnOffTable"></v-list-item>
        <v-list-item prepend-icon="mdi-view-column-outline" title="Column Settings" value="column-settings" router-link to="/column-settings" @click="turnOffTable"></v-list-item>
        <v-list-item prepend-icon="mdi-bell-outline" title="Notification Settings" value="notification-settings" router-link to="/notification-settings" @click="turnOffTable"></v-list-item>
        <v-divider :thickness="8" class="border-opacity-0"></v-divider>
        <v-divider></v-divider>
        <v-divider :thickness="8" class="border-opacity-0"></v-divider>
        <v-list-item> v{{ PackageJSON.version }}</v-list-item>
        <v-list-item style="position: fixed !important; bottom: 0 !important">
          <v-btn color="#5865F2" variant="tonal" class="ml-1 mr-2" @click="ipcRenderer.send('openURL', 'https://discord.com/invite/2vAuyVvdwj')">Discord</v-btn>
          <v-btn color="#6e5494" variant="tonal" class="ml-2 mr-1" @click="ipcRenderer.send('openURL', 'https://github.com/pixelicc/pixelic-overlay')">GitHub</v-btn>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <router-view></router-view>
    <v-data-table v-if="table" :headers="headers" :items="players" :items-per-page="-1" class="datatable elevation-0" density="compact" no-data-text="No Players found" sort-asc-icon="mdi-chevron-up" sort-desc-icon="mdi-chevron-down">
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
                <span v-bind="props" v-html="item.columns.formattedUsername"></span>
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
          <td>
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn size="small" variant="text" icon="mdi-dots-horizontal" v-bind="props" style="height: calc(var(--v-btn-height)) !important"> </v-btn>
              </template>
              <v-list>
                <v-list-item>
                  <v-btn variant="flat" prepend-icon="mdi-chart-timeline-variant-shimmer" router-link to="/statistics" @click="viewStatistics(item.columns.username)">
                    <v-list-item-title>View Statistics</v-list-item-title>
                  </v-btn>
                </v-list-item>
                <v-list-item v-if="!item.columns.blacklisted && !item.columns.isYou">
                  <v-btn variant="flat" prepend-icon="mdi-flag-variant-plus" @click="reportPlayer(item.columns.UUID, 'cheater')">
                    <v-list-item-title>Report for Cheating</v-list-item-title>
                  </v-btn>
                </v-list-item>
                <v-list-item v-if="!item.columns.blacklisted && !item.columns.isYou">
                  <v-btn variant="flat" prepend-icon="mdi-flag-variant-plus" @click="reportPlayer(item.columns.UUID, 'sniper')">
                    <v-list-item-title>Report for Sniping</v-list-item-title>
                  </v-btn>
                </v-list-item>
                <v-list-item v-if="item.columns.blacklisted && !item.columns.isYou">
                  <v-btn variant="flat" prepend-icon="mdi-flag-variant-minus" @click="revokePlayerReport(item.columns.UUID)">
                    <v-list-item-title>Remove from Blacklist</v-list-item-title>
                  </v-btn>
                </v-list-item>
              </v-list>
            </v-menu>
          </td>
        </tr>
      </template>
      <template #bottom></template>
    </v-data-table>
    <v-snackbar :timeout="snackbarTimeout" :color="snackbarColor" :variant="snackbarVariant" v-model="snackbarShown">
      <v-icon v-if="snackbarIcon !== null">{{ snackbarIcon }}</v-icon>
      {{ snackbarText }}
    </v-snackbar>
  </v-app>
</template>

<script setup>
import { useIpcRenderer } from "@vueuse/electron";
import dataStore from "./data/dataStore";
import { parseMessage, getPlayers, addPlayer, refreshPlayers, clear } from "./misc/overlay";
import { ref } from "vue";
import mcColorParser from "./misc/mcColorParser";
import rankParser from "./misc/rankParser";
import starParser from "./misc/starParser";
import tagsParser from "./misc/tagsParser";
import blacklistParser from "./misc/blacklistParser";
import statColorParser from "./misc/statColorParser";
import { snackbarTimeout, snackbarColor, snackbarVariant, snackbarText, snackbarIcon, snackbarShown, sendNotification } from "./misc/snackbarNotification";
import router from "./router";
import axios from "axios";
import PackageJSON from "../package.json";
import { useRoute } from "vue-router";

const route = useRoute();

const ipcRenderer = useIpcRenderer();

var table = ref(0);
table.value = true;

const turnOnTable = () => {
  table.value = true;
  if (dataStore.get("player") !== "" && dataStore.get("pixelicKey") !== "") {
    addPlayer(dataStore.get("player"), { forced: true });
  }
};

const turnOffTable = () => {
  table.value = false;
};

if (dataStore.get("pixelicKey") === "") {
  router.push("/basic-settings");
  turnOffTable();
  ipcRenderer.send("discordAuth");
  ipcRenderer.on("pixelicKey", (event, msg) => {
    dataStore.set("pixelicKey", msg);
  });
}

ipcRenderer.send("windowEvent", dataStore.get("windowLocation"));

ipcRenderer.send("logPath", [dataStore.get("client"), dataStore.get("customLogFilePath")]);
if (dataStore.get("developerMode") === true) ipcRenderer.send("devTools", true);
ipcRenderer.send("discordRPC-set", dataStore.get("discordRPC"));
if (dataStore.get("player") !== "" && dataStore.get("pixelicKey") !== "" && dataStore.get("discordRPC") === true) ipcRenderer.send("discordRPC-init", [dataStore.get("player"), dataStore.get("pixelicKey")]);

var sidebar = ref(0);
sidebar.value = false;

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

  if (/^[a-zA-Z0-9_]{2,16}$/gm.test(player.target["_value"])) {
    if (!table.value) {
      ipcRenderer.send("viewStatistics", player.target["_value"]);
      return;
    } else {
      addPlayer(player.target["_value"], { forced: true });
      return;
    }
  } else if (player.target["_value"] === "") {
    if (!table.value) {
      ipcRenderer.send("viewStatistics", dataStore.get("player"));
      return;
    }
  } else {
    searchErrors.value = ["Invalid Username!"];
    setTimeout(() => {
      searchErrors.value = [];
    }, 500);
    return;
  }
};

const reportPlayer = (UUID, reason) => {
  axios
    .post(
      "https://api.pixelic.de/hypixel/v1/overlay/reportsystem/report",
      {},
      {
        params: {
          UUID: UUID,
          expire: reason === "cheater" ? dataStore.get("blacklistCheaterExpiry") : dataStore.get("blacklistSniperExpiry"),
          reason: reason,
        },
        headers: {
          "X-API-Key": dataStore.get("pixelicKey"),
        },
        timeout: 10000,
      }
    )
    .then(() => {
      blacklistParser.add(UUID, reason);

      sendNotification({
        timeout: 5000,
        color: "success",
        icon: "mdi-database-plus-outline",
        text: "Your report was sucessful! The player was also added to your personal blacklist.",
      });
    })
    .catch((error) => {
      sendNotification({
        timeout: 5000,
        color: "error",
        icon: "mdi-alert-circle",
        text: "An error occured whilst submitting your report!",
      });
    });
};

const revokePlayerReport = (UUID) => {
  axios
    .delete("https://api.pixelic.de/hypixel/v1/overlay/reportsystem/report", {
      params: {
        UUID: UUID,
      },
      headers: {
        "X-API-Key": dataStore.get("pixelicKey"),
      },
      timeout: 10000,
    })
    .then(() => {
      blacklistParser.remove(UUID);
      sendNotification({
        timeout: 5000,
        color: "success",
        icon: "mdi-database-minus-outline",
        text: "Your report was revoked sucessfully! The player was also removed to your personal blacklist.",
      });
    })
    .catch(() => {
      sendNotification({
        timeout: 5000,
        color: "error",
        icon: "mdi-alert-circle",
        text: "An error occured whilst revoking your report!",
      });
    });
};

const viewStatistics = (player) => {
  turnOffTable();
  setTimeout(() => {
    ipcRenderer.send("viewStatistics", player);
  }, 1000);
};

setInterval(() => {
  const Players = [];
  for (var Player of getPlayers()) {
    if (Player?.cause) {
      if (Player.cause.toLowerCase() === "invalid uuid or username") {
        Players.push({
          formattedUsername: mcColorParser(`§c${Player.username}`),
          tags: [{ text: "NICKED", tooltip: "This player is hiding their name!", color: "red-lighten-1" }],
        });
      } else if (Player.cause.toLowerCase() === "this player never played hypixel") {
        Players.push({
          formattedUsername: mcColorParser(`§c${Player.username}`),
          tags: [{ text: "NO-DATA", tooltip: "This player never played on Hypixel!", color: "red-lighten-1" }],
        });
      } else if (Player.cause.toLowerCase() === "invalid api-key") {
        Players.push({
          formattedUsername: mcColorParser(`§c${Player.username}`),
          tags: [{ text: "INVALID API-KEY", tooltip: "You are using an invalid API-Key!", color: "red-lighten-1" }],
        });
      } else {
        Players.push({
          formattedUsername: mcColorParser(`§4${Player.username}`),
          tags: [{ text: "FETCHING-FAILED", tooltip: "Some error occured while fetching!", color: "red-lighten-1" }],
        });
      }
    } else {
      var tags = [...tagsParser(Player.UUID)];
      var blacklisted = false;
      const blacklistCheck = blacklistParser.check(Player.UUID);

      if (blacklistCheck !== null) {
        blacklisted = true;
        if (blacklistCheck === "sniper") {
          tags.push({ text: "SNIPER", tooltip: "Blacklisted", color: "red-accent-4" });
        }
        if (blacklistCheck === "cheater") {
          tags.push({ text: "CHEATER", tooltip: "Blacklisted", color: "red-accent-4" });
        }
      }

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
        isYou: Player.username.toLowerCase() === dataStore.get("player").toLowerCase() || Player.UUID.toLowerCase() === dataStore.get("player").replace(/-/g, "").toLowerCase(),
        blacklisted: blacklisted,
        UUID: Player.UUID,
        username: Player.username,
        fullUsername: mcColorParser(`${rankParser(Player.rank, Player.plusColor, Player.plusPlusColor)[0]} ${Player.username}`),
        formattedUsername: mcColorParser(`${rankParser(Player.rank, Player.plusColor, Player.plusPlusColor)[1]} ${Player.username}`),
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
    { title: "Name", align: "center", key: "formattedUsername", sortable: false, width: "25%" },
    { key: "fullUsername", align: " d-none" },
    { key: "username", align: " d-none" },
    { key: "UUID", align: " d-none" },
    { key: "isYou", align: " d-none" },
    { key: "blacklisted", align: " d-none" },
  ];

  if (selectedHeaders.includes("WS")) headers.value.push({ title: "WS", align: "center", key: "WS", width: "8%" }, { key: "WSFormatted", align: " d-none" });
  if (selectedHeaders.includes("Wins")) headers.value.push({ title: "Wins", align: "center", key: "wins", width: "10%" }, { key: "winsFormatted", align: " d-none" });
  if (selectedHeaders.includes("WLR")) headers.value.push({ title: "WLR", align: "center", key: "WLR", width: "10%" }, { key: "WLRFormatted", align: " d-none" });
  if (selectedHeaders.includes("Finals")) headers.value.push({ title: "Finals", align: "center", key: "finalKills", width: "12%" }, { title: "Finals", key: "finalKillsFormatted", align: " d-none" });
  if (selectedHeaders.includes("FKDR")) headers.value.push({ title: "FKDR", align: "center", key: "FKDR", width: "10%" }, { key: "FKDRFormatted", align: " d-none" });
  if (selectedHeaders.includes("BBLR")) headers.value.push({ title: "BBLR", align: "center", key: "BBLR", width: "10%" }, { key: "BBLRFormatted", align: " d-none" });

  headers.value.push({ width: "5%" });
};

updateHeaders();

setInterval(() => updateHeaders(), 1000);

document.querySelector(":root").style.setProperty("--opacity", dataStore.get("opacity"));
</script>

<style>
.v-application {
  background-color: rgba(var(--v-theme-background), var(--opacity)) !important;
}
.v-tooltip .v-overlay__content {
  background: rgba(var(--v-theme-background), 1) !important;
}

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
