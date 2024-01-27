<template>
  <v-app>
    <Navigation />
    <NuxtPage />
    <v-container>
      <v-row>
        <v-col>
          <v-card :loading="loadingPlayer" title="Overview" :disabled="noPlayer">
            <template v-slot:loader="{ isActive }">
              <v-progress-linear :active="isActive" color="primary" height="4" indeterminate></v-progress-linear>
            </template>
            <div class="ml-4 mr-4 mb-4 mt-2" v-if="!loadingPlayer">
              <!-- @vue-skip -->
              <span v-html="parseMCColor(`${GamemodeManager.hypixelMode.value === 'BEDWARS' ? parseBedwarsStar(playerRef?.stats?.Bedwars?.level || 0).full : GamemodeManager.hypixelMode.value === 'SKYWARS' ? parseSkywarsStar(playerRef?.stats?.Skywars?.level || 0).full : ''} ${parseRank(playerRef?.rank || null, playerRef?.plusColor || null, playerRef?.plusPlusColor || null).full} ${playerRef.username}`)" style="font-size: x-large"></span><br />
              <v-container>
                <v-row>
                  <v-col v-for="(row, rowIndex) of overviewRows">
                    <span v-for="(column, columnIndex) of row"> {{ column.title }}: <span v-html="column.value"></span><br v-if="columnIndex !== overviewRows[rowIndex].length - 1" /></span>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col v-for="(row, rowIndex) of gamemodeRows">
                    <span v-for="(column, columnIndex) of row"> {{ column.title }}: <span v-html="column.value"></span><br v-if="columnIndex !== gamemodeRows[rowIndex].length - 1" /></span>
                  </v-col>
                </v-row>
              </v-container>
            </div>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card :loading="loadingHistory" title="Alltime Graph" :disabled="noHistory">
            <template v-slot:loader="{ isActive }">
              <v-progress-linear :active="isActive" color="primary" height="4" indeterminate></v-progress-linear>
            </template>
            <div class="ma-4">
              <canvas id="alltimeGraph"></canvas>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <Notification />
  </v-app>
</template>

<script setup lang="ts">
import Chart, { type DatasetChartOptions } from "chart.js/auto";
import "chartjs-adapter-moment";
import moment from "moment";
import dataStore from "../electron/store";
import { ipcRenderer } from "electron";

const loadingPlayer = ref(true);
const loadingHistory = ref(true);
const noPlayer = ref(true);
const noHistory = ref(true);
const playerRef = ref();
const overviewRows: Ref<{ title: string; value: string }[][]> = ref([]);
const gamemodeRows: Ref<{ title: string; value: string }[][]> = ref([]);

const playerQuery = ref("");
ipcRenderer.on("openStatistics", async (event, msg) => {
  playerQuery.value = msg;
});

const convertHypixelGameMode = (gameMode: string) => {
  // @ts-ignore
  return Constants.hypixel.games?.[gameMode] || gameMode;
};

var alltimeGraphChart: Chart | null = null;

onMounted(async () => {
  const loadPlayer = async (requestedPlayer: { UUID: string; username: string }) => {
    try {
      noPlayer.value = true;
      noHistory.value = true;
      loadingPlayer.value = true;
      const fetchedPlayer = (await PixelicAPI(`/v2/pixelic-overlay/proxy/hypixel/player/${requestedPlayer.UUID}`)).data.value as any;
      loadingPlayer.value = false;
      noPlayer.value = !fetchedPlayer?.success;
      playerRef.value = fetchedPlayer.player;
      loadingHistory.value = true;
      if (alltimeGraphChart) alltimeGraphChart.destroy();
      const history = (await PixelicAPI(`/v1/hypixel/player/${requestedPlayer.UUID}/history`)).data.value as any;
      noHistory.value = !history;

      const player = playerRef.value;

      overviewRows.value = [];
      overviewRows.value.push([
        { title: "Network Level", value: parseMCColor(`§3${Number(player?.level.toFixed(2)).toLocaleString("en-US")}`) },
        { title: "Network Karma", value: parseMCColor(`§d${formatNumber(player?.karma, 2)}`) },
      ]);
      overviewRows.value.push([
        { title: "Achievement Points", value: parseMCColor(`§e${Number(player?.achievementPoints.toFixed(2)).toLocaleString("en-US")}`) },
        { title: "Ranks gifted", value: parseMCColor(`§b${Number(player?.ranksGifted.toFixed(2)).toLocaleString("en-US")}`) },
      ]);
      overviewRows.value.push([
        { title: "Quests completed", value: parseMCColor(`§a${Number(player?.questsCompleted.toFixed(2)).toLocaleString("en-US")}`) },
        { title: "Challenges completed", value: parseMCColor(`§2${Number(player?.challengesCompleted.toFixed(2)).toLocaleString("en-US")}`) },
      ]);
      overviewRows.value.push([
        { title: "Status", value: player?.online ? parseMCColor(`§aOnline for ${moment.duration(moment().diff(player.lastLogin * 1000)).humanize(false)}`) : player?.online === false ? parseMCColor(`§cOffline for ${moment.duration(moment().diff(player.lastLogout * 1000)).humanize(false)}`) : parseMCColor("§4Hidden") },
        { title: "Last played", value: parseMCColor(player?.lastModePlayed ? `§5${convertHypixelGameMode(player.lastModePlayed)}` : "§4Hidden or Unknown") },
      ]);

      gamemodeRows.value = [];
      if (GamemodeManager.hypixelMode.value === "BEDWARS") {
        gamemodeRows.value.push([
          { title: "Wins", value: parseMCColor(`§a${player?.stats?.Bedwars?.overall?.wins.toLocaleString("en-US")}`) },
          { title: "Losses", value: parseMCColor(`§c${player?.stats?.Bedwars?.overall?.losses.toLocaleString("en-US")}`) },
          { title: "WLR", value: parseMCColor(`§6${Number(player?.stats?.Bedwars?.overall?.WLR.toFixed(2)).toLocaleString("en-US")}`) },
        ]);
        gamemodeRows.value.push([
          { title: "Finalkills", value: parseMCColor(`§a${player?.stats?.Bedwars?.overall?.finalKills.toLocaleString("en-US")}`) },
          { title: "Finaldeaths", value: parseMCColor(`§c${player?.stats?.Bedwars?.overall?.finalDeaths.toLocaleString("en-US")}`) },
          { title: "FKDR", value: parseMCColor(`§6${Number(player?.stats?.Bedwars?.overall?.FKDR.toFixed(2)).toLocaleString("en-US")}`) },
        ]);
        gamemodeRows.value.push([
          { title: "Kills", value: parseMCColor(`§a${player?.stats?.Bedwars?.overall?.kills.toLocaleString("en-US")}`) },
          { title: "Deaths", value: parseMCColor(`§c${player?.stats?.Bedwars?.overall?.deaths.toLocaleString("en-US")}`) },
          { title: "KDR", value: parseMCColor(`§6${Number(player?.stats?.Bedwars?.overall?.WLR.toFixed(2)).toLocaleString("en-US")}`) },
        ]);
        gamemodeRows.value.push([
          { title: "Beds broken", value: parseMCColor(`§a${player?.stats?.Bedwars?.overall?.bedsBroken.toLocaleString("en-US")}`) },
          { title: "Beds lost", value: parseMCColor(`§c${player?.stats?.Bedwars?.overall?.bedsLost.toLocaleString("en-US")}`) },
          { title: "BBLR", value: parseMCColor(`§6${Number(player?.stats?.Bedwars?.overall?.BBLR.toFixed(2)).toLocaleString("en-US")}`) },
        ]);
      }
      if (GamemodeManager.hypixelMode.value === "SKYWARS") {
        gamemodeRows.value.push([
          { title: "Souls", value: parseMCColor(`§b${player?.stats?.Skywars?.souls.toLocaleString("en-US")}`) },
          { title: "Heads", value: parseMCColor(`§3${player?.stats?.Skywars?.totalHeads.toLocaleString("en-US")}`) },
          { title: "Time played", value: parseMCColor(`§2${Math.round(player?.stats?.Skywars?.overall?.timePlayed / 60 / 60)}h`) },
        ]);
        gamemodeRows.value.push([
          { title: "Wins", value: parseMCColor(`§a${player?.stats?.Skywars?.overall?.wins.toLocaleString("en-US")}`) },
          { title: "Losses", value: parseMCColor(`§c${player?.stats?.Skywars?.overall?.losses.toLocaleString("en-US")}`) },
          { title: "WLR", value: parseMCColor(`§6${Number(player?.stats?.Skywars?.overall?.WLR.toFixed(2)).toLocaleString("en-US")}`) },
        ]);
        gamemodeRows.value.push([
          { title: "Kills", value: parseMCColor(`§a${player?.stats?.Skywars?.overall?.kills.toLocaleString("en-US")}`) },
          { title: "Deaths", value: parseMCColor(`§c${player?.stats?.Skywars?.overall?.deaths.toLocaleString("en-US")}`) },
          { title: "KDR", value: parseMCColor(`§6${Number(player?.stats?.Skywars?.overall?.WLR.toFixed(2)).toLocaleString("en-US")}`) },
        ]);
        gamemodeRows.value.push([
          { title: "Arrows shot", value: parseMCColor(`§a${player?.stats?.Skywars?.overall?.arrowsShot.toLocaleString("en-US")}`) },
          { title: "Arrows hit", value: parseMCColor(`§c${player?.stats?.Skywars?.overall?.arrowsHit.toLocaleString("en-US")}`) },
          { title: "AHMR", value: parseMCColor(`§6${Number(player?.stats?.Skywars?.overall?.AHMR.toFixed(2)).toLocaleString("en-US")}`) },
        ]);
      }
      if (GamemodeManager.hypixelMode.value === "DUELS") {
        gamemodeRows.value.push([
          { title: "Wins", value: parseMCColor(`§a${player?.stats?.Duels?.overall?.wins.toLocaleString("en-US")}`) },
          { title: "Losses", value: parseMCColor(`§c${player?.stats?.Duels?.overall?.losses.toLocaleString("en-US")}`) },
          { title: "WLR", value: parseMCColor(`§6${Number(player?.stats?.Duels?.overall?.WLR.toFixed(2)).toLocaleString("en-US")}`) },
        ]);
        gamemodeRows.value.push([
          { title: "Kills", value: parseMCColor(`§a${player?.stats?.Duels?.overall?.kills.toLocaleString("en-US")}`) },
          { title: "Deaths", value: parseMCColor(`§c${player?.stats?.Duels?.overall?.deaths.toLocaleString("en-US")}`) },
          { title: "KDR", value: parseMCColor(`§6${Number(player?.stats?.Duels?.overall?.WLR.toFixed(2)).toLocaleString("en-US")}`) },
        ]);
      }
      if (GamemodeManager.hypixelMode.value === "MURDER_MYSTERY") {
        gamemodeRows.value.push([
          { title: "Games played", value: parseMCColor(`§3${player?.stats?.MurderMystery?.overall?.gamesPlayed.toLocaleString("en-US")}`) },
          { title: "Wins", value: parseMCColor(`§a${player?.stats?.MurderMystery?.overall?.wins.toLocaleString("en-US")}`) },
          { title: "Losses", value: parseMCColor(`§c${player?.stats?.MurderMystery?.overall?.losses.toLocaleString("en-US")}`) },
          { title: "WLR", value: parseMCColor(`§6${Number(player?.stats?.MurderMystery?.overall?.WLR.toFixed(2)).toLocaleString("en-US")}`) },
        ]);
        gamemodeRows.value.push([
          { title: "Murderer Wins", value: parseMCColor(`§c${player?.stats?.MurderMystery?.overall?.murdererWins.toLocaleString("en-US")}`) },
          { title: "Detective Wins", value: parseMCColor(`§b${player?.stats?.MurderMystery?.overall?.detectiveWins.toLocaleString("en-US")}`) },
          { title: "Assassins Wins", value: parseMCColor(`§e${player?.stats?.MurderMystery?.assassins?.wins.toLocaleString("en-US")}`) },
          { title: "Infected Wins", value: parseMCColor(`§a${(player?.stats?.MurderMystery?.infection?.infectedWins).toLocaleString("en-US")}`) },
          { title: "Survivor Wins", value: parseMCColor(`§2${(player?.stats?.MurderMystery?.infection?.survivorWins).toLocaleString("en-US")}`) },
        ]);
        gamemodeRows.value.push([
          { title: "Murderer Kills", value: parseMCColor(`§c${player?.stats?.MurderMystery?.overall?.kills.toLocaleString("en-US")}`) },
          { title: "Detective Kills", value: parseMCColor(`§b${player?.stats?.MurderMystery?.overall?.timesHero.toLocaleString("en-US")}`) },
          { title: "Assassins Kills", value: parseMCColor(`§e${player?.stats?.MurderMystery?.assassins?.kills.toLocaleString("en-US")}`) },
          { title: "Infected Kills", value: parseMCColor(`§a${(player?.stats?.MurderMystery?.infection?.infectedKills).toLocaleString("en-US")}`) },
          { title: "Survivor Kills", value: parseMCColor(`§2${(player?.stats?.MurderMystery?.infection?.survivorKills).toLocaleString("en-US")}`) },
        ]);
        gamemodeRows.value.push([
          { title: "Murderer Chance", value: parseMCColor(`§c${player?.stats?.MurderMystery?.murdererChance}%`) },
          { title: "Detective Chance", value: parseMCColor(`§b${player?.stats?.MurderMystery?.detectiveChance}%`) },
          { title: "Alpha Chance", value: parseMCColor(`§a${player?.stats?.MurderMystery?.alphaChance}%`) },
        ]);
      }

      const filterByTimeframe = (
        arr: {
          timestamp: number;
          [key: string]: any;
        }[],
        timeframe: "7d" | "30d" | "365d" | "alltime"
      ) => {
        if (timeframe === "7d") {
          return arr.filter((datapoint) => datapoint.timestamp > Math.floor(Date.now() / 1000) - 86400 * 7);
        }
        if (timeframe === "30d") {
          return arr.filter((datapoint) => datapoint.timestamp > Math.floor(Date.now() / 1000) - 86400 * 30);
        }
        if (timeframe === "365d") {
          return arr.filter((datapoint) => datapoint.timestamp > Math.floor(Date.now() / 1000) - 86400 * 365);
        }
        return arr;
      };

      const calculateData = (stat: string, timeframe: "7d" | "30d" | "365d" | "alltime", respectMinimum?: boolean) => {
        const data = filterByTimeframe(history.history, timeframe);
        const array = [];
        var latestValue = 0;
        for (const day of data) {
          var currentValue = 0;
          try {
            currentValue = Number(queryJSONPath(day, stat).toFixed(2));
            latestValue = currentValue;
          } catch {
            currentValue = latestValue;
          }
          array.push({ x: day.timestamp * 1000, y: currentValue });
        }
        if (respectMinimum) {
          const minValue = array.filter((datapoint) => datapoint.y !== 0).reduce((min, current) => Math.min(min, current.y), Infinity);
          for (var i = 0; i < array.length; i++) {
            if (array[i].y < minValue) array[i].y = minValue;
          }
        }
        return array;
      };

      const datasets: any[] = [];
      if (GamemodeManager.hypixelMode.value === "BEDWARS") {
        datasets.push({
          borderWidth: 1,
          data: calculateData("$.stats.Bedwars.level", "alltime", true),
          yAxisID: "level",
          label: "Stars (Level)",
          radius: 0,
        });
        datasets.push({
          borderWidth: 1,
          data: calculateData("$.stats.Bedwars.overall.wins", "alltime", true),
          yAxisID: "stat",
          label: "Wins",
          radius: 0,
        });
        datasets.push({
          borderWidth: 1,
          data: calculateData("$.stats.Bedwars.overall.finalKills", "alltime", true),
          yAxisID: "stat",
          label: "Finalkills",
          radius: 0,
        });
        datasets.push({
          borderWidth: 1,
          data: calculateData("$.stats.Bedwars.overall.kills", "alltime", true),
          yAxisID: "stat",
          label: "Kills",
          radius: 0,
        });
        datasets.push({
          borderWidth: 1,
          data: calculateData("$.stats.Bedwars.overall.bedsBroken", "alltime", true),
          yAxisID: "stat",
          label: "Beds broken",
          radius: 0,
        });
      }
      if (GamemodeManager.hypixelMode.value === "SKYWARS") {
        datasets.push({
          borderWidth: 1,
          data: calculateData("$.stats.Skywars.level", "alltime", true),
          yAxisID: "level",
          label: "Stars (Level)",
          radius: 0,
        });
        datasets.push({
          borderWidth: 1,
          data: calculateData("$.stats.Skywars.overall.wins", "alltime", true),
          yAxisID: "stat",
          label: "Wins",
          radius: 0,
        });
        datasets.push({
          borderWidth: 1,
          data: calculateData("$.stats.Skywars.overall.kills", "alltime", true),
          yAxisID: "stat",
          label: "Kills",
          radius: 0,
        });
      }
      if (GamemodeManager.hypixelMode.value === "DUELS") {
        datasets.push({
          borderWidth: 1,
          data: calculateData("$.stats.Duels.overall.wins", "alltime", true),
          yAxisID: "stat",
          label: "Wins",
          radius: 0,
        });
        datasets.push({
          borderWidth: 1,
          data: calculateData("$.stats.Duels.overall.kills", "alltime", true),
          yAxisID: "stat",
          label: "Kills",
          radius: 0,
        });
      }
      if (GamemodeManager.hypixelMode.value === "MURDER_MYSTERY") {
        datasets.push({
          borderWidth: 1,
          data: calculateData("$.stats.MurderMystery.overall.wins", "alltime", true),
          yAxisID: "stat",
          label: "Wins",
          radius: 0,
        });
        datasets.push({
          borderWidth: 1,
          data: calculateData("$.stats.MurderMystery.overall.kills", "alltime", true),
          yAxisID: "stat",
          label: "Kills",
          radius: 0,
        });
      }

      // @ts-ignore
      alltimeGraphChart = new Chart(document.getElementById("alltimeGraph"), {
        type: "line",
        data: {
          datasets,
        },
        options: {
          animation: false,
          parsing: false,
          maintainAspectRatio: true,
          interaction: {
            mode: "nearest",
            axis: "x",
            intersect: false,
          },
          plugins: {
            decimation: {
              enabled: true,
              algorithm: "lttb",
              samples: 50,
            },
          },
          scales: {
            x: {
              type: "time",
              ticks: {
                source: "auto",
                maxRotation: 0,
                autoSkip: true,
              },
            },
            stat: {
              display: true,
              position: "left",
            },
            level: {
              title: {
                text: "Level",
                display: true,
              },
              display: ["BEDWARS", "SKYWARS"].includes(GamemodeManager.hypixelMode.value),
              position: "right",
            },
          },
        },
      });

      loadingHistory.value = false;
    } catch (error) {
      loadingHistory.value = false;
      if (!String(error).includes("Canvas is already in use.")) {
        noPlayer.value = true;
        noHistory.value = true;
        sendNotification({ icon: "mdi-alert-circle", text: "An error occured whilst trying to load the Players Statistics!", color: "error" });
      }
    }
  };
  const findPlayer = async () => {
    if (!useRoute().query.UUID) {
      loadPlayer({ UUID: (await parseUUID(dataStore.get("overlaySettings").username)) as string, username: dataStore.get("overlaySettings").username });
    } else {
      loadPlayer({ UUID: useRoute().query.UUID as string, username: useRoute().query.username as string });
    }
  };
  findPlayer();
  watch(GamemodeManager.hypixelMode, () => findPlayer());
  watch(playerQuery, async () => {
    loadPlayer({ UUID: (await parseUUID(playerQuery.value)) as string, username: playerQuery.value });
  });
});
</script>
