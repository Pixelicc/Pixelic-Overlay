import log from "electron-log";
import axios from "axios";
// @ts-ignore
import * as RPC from "discord-rpc";
import { parseBedwarsStar, parseSkywarsStar } from "../../utils/levelParser";
import { parseRank } from "../../utils/rankParser";
import dataStore from "../store";
import PackageJSON from "../../package.json";

const getAPI = () => {
  if (dataStore.get("overlaySettings").advancedMode && dataStore.get("APISettings").customInstanceSettings.baseURL.length !== 0) {
    return dataStore.get("APISettings").customInstanceSettings.baseURL;
  }
  return "https://api.pixelic.app";
};

export default (UUID: string) => {
  try {
    const startTimestamp = new Date();
    const client = new RPC.Client({ transport: "ipc" });

    RPC.register("1109792550459539546");

    const setActivity = async () => {
      axios
        .get(`${getAPI()}/v2/pixelic-overlay/proxy/hypixel/player/${UUID}`, { headers: { "X-API-Key": dataStore.get("APISettings").key, "X-Overlay-Version": PackageJSON.version } })
        .then(async (res) => {
          const player = res?.data?.player;
          var details = `${parseRank(player.rank, player.plusColor, player.plusPlusColor).full.replace(/§./g, "")} ${player.username}`;
          var state = "";
          var smallImageKey = "hypixel";
          var smallImageText = "Playing mc.hypixel.net";
          if (dataStore.get("hypixelSettings").mode === "BEDWARS") {
            details = `${parseBedwarsStar(player?.stats?.Bedwars?.level).full.replace(/§./g, "")} ${parseRank(player.rank, player.plusColor, player.plusPlusColor).full.replace(/§./g, "")} ${player.username}`;
            state = `Wins: ${(player?.stats?.Bedwars?.overall?.wins || 0).toLocaleString("en-US")} | Finals: ${(player?.stats?.Bedwars?.overall?.finalKills || 0).toLocaleString("en-US")}`;
            smallImageKey = "bedwars";
            smallImageText = "Playing Bedwars on mc.hypixel.net";
          } else if (dataStore.get("hypixelSettings").mode === "SKYWARS") {
            details = `${parseSkywarsStar(player?.stats?.Skywars?.level).full.replace(/§./g, "")} ${parseRank(player.rank, player.plusColor, player.plusPlusColor).full.replace(/§./g, "")} ${player.username}`;
            state = `Wins: ${(player?.stats?.Skywars?.overall?.wins || 0).toLocaleString("en-US")} | Kills: ${(player?.stats?.Skywars?.overall?.kills || 0).toLocaleString("en-US")}`;
            smallImageKey = "skywars";
            smallImageText = "Playing Skywars on mc.hypixel.net";
          } else if (dataStore.get("hypixelSettings").mode === "DUELS") {
            state = `Wins: ${(player?.stats?.Duels?.overall?.wins || 0).toLocaleString("en-US")} | Kills: ${(player?.stats?.Bedwars?.Duels?.kills || 0).toLocaleString("en-US")}`;
            smallImageKey = "duels";
            smallImageText = "Playing Duels on mc.hypixel.net";
          } else {
            state = `Wins: ${(player?.stats?.MurderMystery?.overall?.wins || 0).toLocaleString("en-US")} | Times Hero: ${(player?.stats?.MurderMystery?.overall?.timesHero || 0).toLocaleString("en-US")}`;
            smallImageKey = "murder_mystery";
            smallImageText = "Playing MurderMystery on mc.hypixel.net";
          }
          client.setActivity({
            instance: false,
            details,
            state,
            startTimestamp,
            largeImageKey: "pixelic",
            largeImageText: `Pixelic-Overlay v${PackageJSON.version}`,
            smallImageKey,
            smallImageText,
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

    client.on("ready", () => {
      setActivity();
      const interval = setInterval(() => {
        if (dataStore.get("overlaySettings").discordRPC === false) {
          client.destroy();
          clearInterval(interval);
        }
        setActivity();
      }, 60 * 1000);
    });

    client.login({ clientId: "1109792550459539546" });
  } catch (e) {
    log.error(`Discord RPC: ${e}`);
  }
};
