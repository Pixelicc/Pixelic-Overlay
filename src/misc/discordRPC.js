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
        }, 15 * 60 * 1000);
      });

      client.login({ clientId: "1109792550459539546" }).catch((e) => console.error(e));
    } catch (error) {
      console.log("Starting RPC failed :", error);
    }
  },
};
