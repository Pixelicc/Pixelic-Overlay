import log from "electron-log";
import axios from "axios";
// @ts-ignore
import * as RPC from "discord-rpc";
import dataStore from "../store";
import PackageJSON from "../../package.json";

export const getAPIInstance = () => {
  if (dataStore.get("advancedMode") && dataStore.get("APIInstance").length !== 0) {
    return dataStore.get("APIInstance");
  }
  return process.env.VITE_DEV_SERVER_URL ? "http://localhost:3000" : "https://api.pixelic.de";
};

export default {
  init: (UUID: string) => {
    try {
      const startTimestamp = new Date();
      const client = new RPC.Client({ transport: "ipc" });

      RPC.register("1109792550459539546");

      const setActivity = async () => {
        axios
          .get(`${getAPIInstance()}/v2/pixelic-overlay/proxy/hypixel/player/${UUID}`, { headers: { "X-API-Key": dataStore.get("APIKey"), "User-Agent": `Pixelic-Overlay/${PackageJSON.version} (DiscordRPC)` } })
          .then(async (res) => {
            const level = Math.floor(res.data.player.stats.Bedwars.level);
            var star = "✫";

            if (level >= 1100) star = "✪";
            if (level >= 2100) star = "⚝";
            if (level >= 3100) star = "✥";

            client.setActivity({
              instance: false,
              details: `[${level}${star}] ${res.data.player.username}`,
              state: `Wins: ${res.data.player.stats.Bedwars.overall.wins.toLocaleString("en-US")} | Finals: ${res.data.player.stats.Bedwars.overall.finalKills.toLocaleString("en-US")} | Beds: ${res.data.player.stats.Bedwars.overall.bedsBroken.toLocaleString("en-US")}`,
              startTimestamp,
              largeImageKey: "pixelic",
              largeImageText: `Pixelic-Overlay v${PackageJSON.version}`,
              smallImageKey: "hypixel",
              smallImageText: "Playing mc.hypixel.net",
              buttons: [
                {
                  label: "Discord",
                  url: "https://discord.gg/2vAuyVvdwj",
                },
                {
                  label: "Download Overlay",
                  url: "https://github.com/Pixelicc/Pixelic-Overlay",
                },
              ],
            });
          })
          .catch((e) => log.error(`Discord RPC: Failed to Fetch Player Data for ${UUID} (Status Code: ${e?.response?.status || "Unknown"} | Cause: ${e?.response?.data?.cause || "Unknown"})`));
      };

      client.on("ready", async () => {
        setActivity();

        const interval = setInterval(async () => {
          if (dataStore.get("discordRPC") === false) {
            client.destroy();
            clearInterval(interval);
          }
          await setActivity();
        }, 60 * 1000);
      });

      client.login({ clientId: "1109792550459539546" }).catch((e: any) => log.error(`Discord RPC: ${e}`));
    } catch (e) {
      log.error(`Discord RPC: ${e}`);
    }
  },
};
