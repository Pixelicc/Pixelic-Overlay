const axios = require("axios");
const rpc = require("discord-rpc");
var client = null;

const startTimestamp = new Date();

var active = false;

module.exports = {
  set: (value) => {
    if (value == false && active == true) {
      client.destroy();
    }
    active = value;
  },
  init: (playerName, key) => {
    if (active == false) {
      return;
    }

    try {
      client = new rpc.Client({ transport: "ipc" });

      rpc.register("1109792550459539546");

      const setActivity = async (player, key) => {
        axios
          .get(`https://api.pixelic.de/hypixel/v1/overlay/player/${player}`, { headers: { "X-API-Key": key } })
          .then(async (res) => {
            res = res.data;

            const level = Math.floor(res.Bedwars.level);
            var star = "✫";

            if (level >= 1100) star = "✪";
            if (level >= 2100) star = "⚝";
            if (level >= 3100) star = "✥";

            client.setActivity({
              instance: false,
              details: `[${level}${star}] ${res.username}`,
              state: `Lifetime » Wins: ${res.Bedwars.overall.wins.toLocaleString("en-US")} | Finals: ${res.Bedwars.overall.finalKills.toLocaleString("en-US")} | Beds: ${res.Bedwars.overall.bedsBroken.toLocaleString("en-US")}`,
              startTimestamp,
              largeImageKey: "pixelic",
              largeImageText: "Pixelic-Overlay",
              smallImageKey: "hypixel",
              smallImageText: "Playing mc.hypixel.net",
              buttons: [
                {
                  label: "Discord",
                  url: "https://discord.gg/2vAuyVvdwj",
                },
                {
                  label: "Get Overlay!",
                  url: "https://github.com/Pixelicc/Pixelic-Overlay",
                },
              ],
            });

            setTimeout(() => {
              axios
                .get(`https://api.pixelic.de/hypixel/v1/player/${playerName}/all`, { headers: { "X-API-Key": key } })
                .then(async (historical) => {
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

                  for (const mode of ["Yearly", "Monthly", "Weekly", "Daily"]) {
                    var modeData = {};
                    if (mode === "Daily") {
                      modeData = dailyData;
                    }
                    if (mode === "Weekly") {
                      modeData = weeklyData;
                    }
                    if (mode === "Monthly") {
                      modeData = monthlyData;
                    }
                    if (mode === "Yearly") {
                      modeData = yearlyData;
                    }

                    var activity = {
                      instance: false,
                      details: "",
                      state: "",
                      startTimestamp,
                      largeImageKey: "pixelic",
                      largeImageText: "Pixelic-Overlay",
                      smallImageKey: "hypixel",
                      smallImageText: "Playing mc.hypixel.net",
                      buttons: [
                        {
                          label: "Discord",
                          url: "https://discord.gg/2vAuyVvdwj",
                        },
                        {
                          label: "Get Overlay!",
                          url: "https://github.com/Pixelicc/Pixelic-Overlay",
                        },
                      ],
                    };

                    if (Object.keys(modeData).length === 0) {
                      activity.details = `[0.00✫] ${res.username}`;
                      activity.state = `${mode} » Wins: 0 | Finals: 0 | Beds: 0`;
                    } else {
                      activity.details = `[${(res.Bedwars.level - modeData.Bedwars.level).toFixed(2)}✫] ${res.username}`;
                      activity.state = `${mode} » Wins: ${(res.Bedwars.overall.wins - modeData.Bedwars.overall.wins).toLocaleString("en-US")} | Finals: ${(res.Bedwars.overall.finalKills - modeData.Bedwars.overall.finalKills).toLocaleString("en-US")} | Beds: ${(res.Bedwars.overall.bedsBroken - modeData.Bedwars.overall.bedsBroken).toLocaleString("en-US")}`;
                    }

                    client.setActivity(activity);

                    await new Promise((resolve) => setTimeout(resolve, 30000));
                  }
                })
                .catch((e) => console.error(e));
            }, 30 * 1000);
          })
          .catch((e) => console.error(e));
      };

      client.on("ready", async () => {
        setActivity(playerName, key).then(() => {});

        const interval = setInterval(async () => {
          if (active == false) {
            clearInterval(interval);
          }
          await setActivity(playerName, key);
        }, 2.5 * 60 * 1000);
      });

      client.login({ clientId: "1109792550459539546" }).catch((e) => console.error(e));
    } catch (error) {
      console.log("Starting RPC failed :", error);
    }
  },
};
