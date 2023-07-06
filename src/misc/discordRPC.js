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

      const setActivity = async (player) => {
        axios
          .get(`BACKEND`) // Waiting for Hypixel to accept my Application
          .then(async (res) => {
            res = res.data;

            const level = Math.floor(res.stats.Bedwars.level);
            var star = "✫";

            if (level >= 1100) star = "✪";
            if (level >= 2100) star = "⚝";
            if (level >= 3100) star = "✥";

            client.setActivity({
              instance: false,
              details: `[${level}${star}] ${res.username}`,
              state: `Lifetime » Wins: ${res.stats.Bedwars.overall.wins.toLocaleString("en-US")} | Finals: ${res.stats.Bedwars.overall.finalKills.toLocaleString("en-US")} | Beds: ${res.stats.Bedwars.overall.bedsBroken.toLocaleString("en-US")}`,
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
          })
          .catch((e) => console.error(e));
      };

      client.on("ready", async () => {
        setActivity(playerName).then(() => {});

        const interval = setInterval(async () => {
          if (active == false) {
            clearInterval(interval);
          }
          await setActivity(playerName);
        }, 60 * 1000);
      });

      client.login({ clientId: "1109792550459539546" }).catch((e) => console.error(e));
    } catch (error) {
      console.log("Starting RPC failed :", error);
    }
  },
};
