<template>
  <v-app>
    <v-container>
      <v-row
        ><v-col
          ><v-sheet class="text-center"
            ><b><span v-html="playerFormatted"></span></b></v-sheet></v-col
      ></v-row>
      <v-row dense>
        <v-col>
          <v-list density="compact">
            <v-list-subheader><strong>Daily</strong></v-list-subheader>

            <v-list-item v-for="(item, i) in historicalData.daily" :key="i" :value="item" base-color="secondary" rounded="xl">
              <v-list-item-title v-text="item.text + ' ' + item.value.toLocaleString('en-US')"></v-list-item-title>
            </v-list-item>
          </v-list>
        </v-col>
        <v-col>
          <v-list density="compact">
            <v-list-subheader><strong>Weekly</strong></v-list-subheader>

            <v-list-item v-for="(item, i) in historicalData.weekly" :key="i" :value="item" base-color="secondary" rounded="xl">
              <v-list-item-title v-text="item.text + ' ' + item.value.toLocaleString('en-US')"></v-list-item-title>
            </v-list-item>
          </v-list>
        </v-col>
        <v-col>
          <v-list density="compact">
            <v-list-subheader><strong>Monthly</strong></v-list-subheader>

            <v-list-item v-for="(item, i) in historicalData.monthly" :key="i" :value="item" base-color="secondary" rounded="xl">
              <v-list-item-title v-text="item.text + ' ' + item.value.toLocaleString('en-US')"></v-list-item-title>
            </v-list-item>
          </v-list>
        </v-col> </v-row
      ><v-row>
        <v-col>
          <v-card><canvas id="weeklyChart"></canvas></v-card>
        </v-col>
      </v-row>
      <v-row
        ><v-col class="pr-0">
          <v-list density="compact">
            <v-list-subheader
              ><strong>Yearly {{ resetTime.yearly }}</strong></v-list-subheader
            >
            <v-list-item v-for="(item, i) in historicalData.yearly.slice(1, 7)" :key="i" :value="item" base-color="secondary" rounded="xl">
              <v-list-item-title v-text="item.text + ' ' + item.value.toLocaleString('en-US')"></v-list-item-title>
            </v-list-item>
          </v-list>
        </v-col>
        <v-col class="pl-0">
          <v-list density="compact">
            <v-list-subheader
              ><strong> Stars gained - {{ historicalData.yearly[0].value }}</strong></v-list-subheader
            >
            <v-list-item v-for="(item, i) in historicalData.yearly.slice(7, 13)" :key="i" :value="item" base-color="secondary" rounded="xl">
              <v-list-item-title v-text="item.text + ' ' + item.value.toLocaleString('en-US')"></v-list-item-title>
            </v-list-item>
          </v-list> </v-col
      ></v-row>
      <v-row>
        <v-col>
          <v-card><canvas id="monthlyChart"></canvas></v-card>
        </v-col> </v-row></v-container
  ></v-app>
</template>

<script setup>
import axios from "axios";
import moment from "moment";
import { ref, onMounted } from "vue";
import { useIpcRenderer } from "@vueuse/electron";
import mcColorParser from "../misc/mcColorParser";
import rankParser from "../misc/rankParser";
import starParser from "../misc/starParser";

import dataStore from "../data/dataStore";

const ipcRenderer = useIpcRenderer();

var playerName = dataStore.get("player");

var playerFormatted = ref(0);

const getRatio = (a, b) => {
  if (a == 0) {
    return 0;
  }
  if (b == 0) {
    return a;
  }
  return Number(a / b).toFixed(2);
};

var historicalData = ref(0);
var resetTime = ref(0);

historicalData.value = {
  daily: [
    { text: "Stars:", value: "0.00✫" },
    { text: "Wins:", value: 0 },
    { text: "Losses:", value: 0 },
    { text: "WLR:", value: 0 },
    { text: "Finalkills:", value: 0 },
    { text: "Finaldeaths:", value: 0 },
    { text: "FKDR:", value: 0 },
    { text: "Kills:", value: 0 },
    { text: "Deaths:", value: 0 },
    { text: "KDR:", value: 0 },
    { text: "Beds broken:", value: 0 },
    { text: "Beds lost:", value: 0 },
    { text: "BBLR:", value: 0 },
  ],
  weekly: [
    { text: "Stars:", value: "0.00✫" },
    { text: "Wins:", value: 0 },
    { text: "Losses:", value: 0 },
    { text: "WLR:", value: 0 },
    { text: "Finalkills:", value: 0 },
    { text: "Finaldeaths:", value: 0 },
    { text: "FKDR:", value: 0 },
    { text: "Kills:", value: 0 },
    { text: "Deaths:", value: 0 },
    { text: "KDR:", value: 0 },
    { text: "Beds broken:", value: 0 },
    { text: "Beds lost:", value: 0 },
    { text: "BBLR:", value: 0 },
  ],
  monthly: [
    { text: "Stars:", value: "0.00✫" },
    { text: "Wins:", value: 0 },
    { text: "Losses:", value: 0 },
    { text: "WLR:", value: 0 },
    { text: "Finalkills:", value: 0 },
    { text: "Finaldeaths:", value: 0 },
    { text: "FKDR:", value: 0 },
    { text: "Kills:", value: 0 },
    { text: "Deaths:", value: 0 },
    { text: "KDR:", value: 0 },
    { text: "Beds broken:", value: 0 },
    { text: "Beds lost:", value: 0 },
    { text: "BBLR:", value: 0 },
  ],
  yearly: [
    { text: "Stars:", value: "0.00✫" },
    { text: "Wins:", value: 0 },
    { text: "Losses:", value: 0 },
    { text: "WLR:", value: 0 },
    { text: "Finalkills:", value: 0 },
    { text: "Finaldeaths:", value: 0 },
    { text: "FKDR:", value: 0 },
    { text: "Kills:", value: 0 },
    { text: "Deaths:", value: 0 },
    { text: "KDR:", value: 0 },
    { text: "Beds broken:", value: 0 },
    { text: "Beds lost:", value: 0 },
    { text: "BBLR:", value: 0 },
  ],
};

resetTime.value = {
  yearly: "- First Datapoint: N/A",
};

const updateData = async () => {
  if (Chart.getChart("weeklyChart") !== undefined) {
    Chart.getChart("weeklyChart").destroy();
  }

  if (Chart.getChart("monthlyChart") !== undefined) {
    Chart.getChart("monthlyChart").destroy();
  }

  playerFormatted.value = "N/A";

  const playerData = await axios.get(`https://api.pixelic.de/hypixel/v1/overlay/player/${playerName}`, { headers: { "X-API-Key": dataStore.get("pixelicKey") } }).catch((error) => console.error("Invalid Hypixel Player"));
  playerFormatted.value = mcColorParser(`${starParser(Math.floor(playerData.data.Bedwars.level))[0]} ${rankParser(playerData.data.rank, playerData.data.plusColor, playerData.data.plusPlusColor)[0]} ${playerData.data.username}`);

  axios.get(`https://api.pixelic.de/hypixel/v1/player/${playerName}/all`, { headers: { "X-API-Key": dataStore.get("pixelicKey") } }).then((historical) => {
    historical = historical.data;

    var dailyData = {};
    var weeklyData = {};
    var monthlyData = {};
    var yearlyData = {};

    if (historical.data[0].date === new Date().toISOString().slice(0, 10)) dailyData = historical.data[0];

    for (const day of historical.data.slice(0, 7).reverse()) {
      var today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
      var lastSunday = new Date(today.setDate(today.getDate() - today.getDay())).setHours(0, 0, 0, 0);
      if (day.timestamp * 1000 > lastSunday.valueOf()) {
        weeklyData = day;
        break;
      }
    }

    for (const day of historical.data.slice(0, 31).reverse()) {
      if (new Date(day.timestamp * 1000).getMonth() === new Date().getMonth()) {
        monthlyData = day;
        break;
      }
    }

    for (const day of historical.data.slice(0, 366).reverse()) {
      if (day.timestamp < new Date(new Date().getUTCFullYear(), 0, 1, 0, 0, 0, 0).valueOf()) {
        yearlyData = day;
        break;
      }
    }

    var weeklyChartData = historical.data.slice(0, 7).reverse();
    weeklyChartData[weeklyChartData.length] = { timestamp: Math.floor(Date.now() / 1000), Bedwars: playerData.data.Bedwars };
    var parsedWeeklyData = weeklyChartData.filter((day) => day.timestamp * 1000 >= Date.now() - 7 * 86400000);

    const daysWeekly = [];

    const winsWeekly = [];
    const finalsKillsWeekly = [];
    const killsWeekly = [];
    const bedsBrokenWeekly = [];

    for (const day in parsedWeeklyData) {
      if (day == 0) continue;

      const currentDay = parsedWeeklyData[day];
      const yesterday = parsedWeeklyData[day - 1];

      const date = new Date();
      date.setDate(date.getDate() - 1 * (parsedWeeklyData.length - day - 1));

      daysWeekly.push(`${date.toISOString().slice(0, 10)} - ${(currentDay.Bedwars.level - yesterday.Bedwars.level).toFixed(2)}✫`);
      winsWeekly.push(currentDay.Bedwars.overall.wins - yesterday.Bedwars.overall.wins);
      finalsKillsWeekly.push(currentDay.Bedwars.overall.finalKills - yesterday.Bedwars.overall.finalKills);
      killsWeekly.push(currentDay.Bedwars.overall.kills - yesterday.Bedwars.overall.kills);
      bedsBrokenWeekly.push(currentDay.Bedwars.overall.bedsBroken - yesterday.Bedwars.overall.bedsBroken);
    }

    var weeklyChart = document.getElementById("weeklyChart");

    new Chart(weeklyChart, {
      type: "bar",
      data: {
        labels: daysWeekly,
        datasets: [
          {
            label: "Daily Wins",
            data: winsWeekly,
            borderWidth: 2,
          },
          {
            label: "Daily Finals",
            data: finalsKillsWeekly,
            borderWidth: 2,
          },
          {
            label: "Daily Kills",
            data: killsWeekly,
            borderWidth: 2,
          },
          {
            label: "Daily Beds broken",
            data: bedsBrokenWeekly,
            borderWidth: 2,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
      },
    });

    var monthlyChartData = historical.data.reverse();
    var parsedMonthlyData = [];

    const daysMonthly = [];

    const winsMonthly = [];
    const finalsKillsMonthly = [];
    const killsMonthly = [];
    const bedsBrokenMonthly = [];

    var firstMonth = null;

    for (const day in monthlyChartData) {
      if (monthlyChartData[day].timestamp < Math.floor(new Date(new Date().getFullYear(), 0, 1, 0, 0, 0, 0).valueOf() / 1000)) continue;

      const getMonth = new Date(monthlyChartData[day].timestamp * 1000).getMonth();

      if (firstMonth === null) {
        firstMonth = getMonth;
      }

      if (parsedMonthlyData[getMonth - firstMonth] !== undefined) continue;

      parsedMonthlyData.push(monthlyChartData[day]);
    }

    parsedMonthlyData[parsedMonthlyData.length] = { Bedwars: playerData.data.Bedwars };

    for (const month in parsedMonthlyData) {
      if (month == 0) continue;

      const currentMonth = parsedMonthlyData[month];
      const lastMonth = parsedMonthlyData[month - 1];

      const date = new Date();
      date.setDate(1);
      date.setMonth(date.getMonth() - 1 * (parsedMonthlyData.length - month - (new Date(parsedMonthlyData[parsedMonthlyData.length - 2].timestamp * 1000).getMonth() !== new Date().getMonth() - 1 ? 1 : 0)));

      daysMonthly.push(`${date.toISOString().slice(0, 7)} - ${(currentMonth.Bedwars.level - lastMonth.Bedwars.level).toFixed(2)}✫`);
      winsMonthly.push(currentMonth.Bedwars.overall.wins - lastMonth.Bedwars.overall.wins);
      finalsKillsMonthly.push(currentMonth.Bedwars.overall.finalKills - lastMonth.Bedwars.overall.finalKills);
      killsMonthly.push(currentMonth.Bedwars.overall.kills - lastMonth.Bedwars.overall.kills);
      bedsBrokenMonthly.push(currentMonth.Bedwars.overall.bedsBroken - lastMonth.Bedwars.overall.bedsBroken);
    }

    var monthlyChart = document.getElementById("monthlyChart");

    new Chart(monthlyChart, {
      type: "bar",
      data: {
        labels: daysMonthly,
        datasets: [
          {
            label: "Monthly Wins",
            data: winsMonthly,
            borderWidth: 2,
          },
          {
            label: "Monthly Finals",
            data: finalsKillsMonthly,
            borderWidth: 2,
          },
          {
            label: "Monthly Kills",
            data: killsMonthly,
            borderWidth: 2,
          },
          {
            label: "Monthly Beds broken",
            data: bedsBrokenMonthly,
            borderWidth: 2,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
      },
    });

    for (const mode of ["daily", "weekly", "monthly", "yearly"]) {
      var modeData = {};
      if (mode === "daily") {
        modeData = dailyData;
      }
      if (mode === "weekly") {
        modeData = weeklyData;
      }
      if (mode === "monthly") {
        modeData = monthlyData;
      }
      if (mode === "yearly") {
        modeData = yearlyData;
      }

      if (Object.keys(modeData).length === 0) continue;

      moment.relativeTimeThreshold("w", 5);
      moment.relativeTimeThreshold("d", 7);
      moment.relativeTimeThreshold("h", 24);

      if (mode === "yearly") {
        resetTime.value[mode] = `- First Datapoint: ${modeData.date}`;
      }

      const historicalBedwars = {
        stars: `${(playerData.data.Bedwars.level - modeData.Bedwars.level).toFixed(2).toLocaleString("en-US")}✫`,
        wins: playerData.data.Bedwars.overall.wins - modeData.Bedwars.overall.wins,
        losses: playerData.data.Bedwars.overall.losses - modeData.Bedwars.overall.losses,
        WLR: getRatio(playerData.data.Bedwars.overall.wins - modeData.Bedwars.overall.wins, playerData.data.Bedwars.overall.losses - modeData.Bedwars.overall.losses),
        finalKills: playerData.data.Bedwars.overall.finalKills - modeData.Bedwars.overall.finalKills,
        finalDeaths: playerData.data.Bedwars.overall.finalDeaths - modeData.Bedwars.overall.finalDeaths,
        FKDR: getRatio(playerData.data.Bedwars.overall.finalKills - modeData.Bedwars.overall.finalKills, playerData.data.Bedwars.overall.finalDeaths - modeData.Bedwars.overall.finalDeaths),
        kills: playerData.data.Bedwars.overall.kills - modeData.Bedwars.overall.kills,
        deaths: playerData.data.Bedwars.overall.deaths - modeData.Bedwars.overall.deaths,
        KDR: getRatio(playerData.data.Bedwars.overall.kills - modeData.Bedwars.overall.kills, playerData.data.Bedwars.overall.deaths - modeData.Bedwars.overall.deaths),
        bedsBroken: playerData.data.Bedwars.overall.bedsBroken - modeData.Bedwars.overall.bedsBroken,
        bedsLost: playerData.data.Bedwars.overall.bedsLost - modeData.Bedwars.overall.bedsLost,
        BBLR: getRatio(playerData.data.Bedwars.overall.bedsBroken - modeData.Bedwars.overall.bedsBroken, playerData.data.Bedwars.overall.bedsLost - modeData.Bedwars.overall.bedsLost),
      };

      for (const value in Object.values(historicalBedwars)) {
        historicalData.value[mode][value].value = Object.values(historicalBedwars)[value];
      }
    }
  });
};

onMounted(() => {
  updateData().then(() => {});
});

setInterval(async () => await updateData(), 15 * 60 * 10000);

ipcRenderer.on("viewStatistics", (event, msg) => {
  playerName = msg;
  updateData();
});
</script>
