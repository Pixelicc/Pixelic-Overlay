import axios from "axios";
import axiosRetry from "axios-retry";
import { useIpcRenderer } from "@vueuse/electron";

import dataStore from "../data/dataStore";

const ipcRenderer = useIpcRenderer();

var players = [];
var playersInQueue = []; // Needed as the API Requests can't be handled instantly

const removeDuplicates = () => {
  playersInQueue = [...new Set(playersInQueue)];
  players = [...new Map(players.map((player) => [player.username, player])).values()];
};

const axiosClient = axios.create();

axiosRetry(axiosClient, {
  retries: 10,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    if (error?.response?.status) {
      return error.response.status === 429;
    }
    return false;
  },
});

var inLobby = false;

const getRatio = (a, b) => {
  if (a == 0) {
    return 0;
  }
  if (b == 0) {
    return a;
  }
  return Number(a / b);
};

const addPlayer = (player, forced) => {
  playersInQueue.push(player);
  if (!players.some((p) => p.username === player) || forced) {
    var headers = {};
    if (forced) {
      headers = {
        "Cache-Control": "no-cache",
        Expires: "0",
      };
    }
    axiosClient
      .get(`BACKEND`, { headers: headers }) // Waiting for Hypixel to accept my Application
      .then((data) => {
        if ((playersInQueue.includes(player) && inLobby !== true) || forced) {
          var Player = { success: true, username: data.data.username, UUID: data.data.UUID, rank: data.data.rank, plusColor: data.data.plusColor, plusPlusColor: data.data.plusPlusColor, ...data.data.stats.Bedwars };
          Player.cores = {
            wins: Player.overall.wins - Player["4v4"].wins,
            losses: Player.overall.losses - Player["4v4"].losses,
            WLR: getRatio(Player.overall.wins - Player["4v4"].wins, Player.overall.losses - Player["4v4"].losses),
            finalKills: Player.overall.finalKills - Player["4v4"].finalKills,
            finalDeaths: Player.overall.finalDeaths - Player["4v4"].finalDeaths,
            FKDR: getRatio(Player.overall.finalKills - Player["4v4"].finalKills, Player.overall.finalDeaths - Player["4v4"].finalDeaths),
            kills: Player.overall.kills - Player["4v4"].kills,
            deaths: Player.overall.deaths - Player["4v4"].deaths,
            KDR: getRatio(Player.overall.kills - Player["4v4"].kills, Player.overall.deaths - Player["4v4"].deaths),
            bedsBroken: Player.overall.bedsBroken - Player["4v4"].bedsBroken,
            bedsLost: Player.overall.bedsLost - Player["4v4"].bedsLost,
            BBLR: getRatio(Player.overall.bedsBroken - Player["4v4"].bedsBroken, Player.overall.bedsLost - Player["4v4"].bedsLost),
            resourcesCollected: {
              iron: Player.overall.resourcesCollected.iron - Player["4v4"].resourcesCollected.iron,
              gold: Player.overall.resourcesCollected.gold - Player["4v4"].resourcesCollected.gold,
              diamond: Player.overall.resourcesCollected.diamond - Player["4v4"].resourcesCollected.diamond,
              emerald: Player.overall.resourcesCollected.emerald - Player["4v4"].resourcesCollected.emerald,
            },
          };
          if (dataStore.get("developerMode") === true) {
            Player.headers = data.headers;
          }
          players.push(Player);
          removeDuplicates();
        }
      })
      .catch((error) => {
        const defaultBedwarsObject = {
          gamesPlayed: 0,
          winstreak: 0,
          wins: 0,
          losses: 0,
          WLR: 0,
          finalKills: 0,
          finalDeaths: 0,
          FKDR: 0,
          kills: 0,
          deaths: 0,
          KDR: 0,
          bedsBroken: 0,
          bedsLost: 0,
          BBLR: 0,
          resourcesCollected: {
            iron: 0,
            gold: 0,
            diamond: 0,
            emerald: 0,
          },
        };
        if (inLobby !== true || forced) {
          players.push({ success: false, cause: error.response.data.cause, username: player, ...{ EXP: 500, level: 1, coins: 0, overall: defaultBedwarsObject, cores: defaultBedwarsObject, solo: defaultBedwarsObject, doubles: defaultBedwarsObject, threes: defaultBedwarsObject, fours: defaultBedwarsObject, "4v4": defaultBedwarsObject } });
          removeDuplicates();
        }
      });
  }
};

const removePlayer = (player) => {
  playersInQueue = playersInQueue.filter((p) => {
    return p !== player;
  });
  players = players.filter((p) => {
    return p.username !== player;
  });
};

const clear = () => {
  playersInQueue = [];
  players = [];
  addPlayer(dataStore.get("player"), true);
};

/**
 * (parameter) msg: string
 * @param {String} msg
 */
const parseMessage = (msg) => {
  if (msg.indexOf("ONLINE:") !== -1 && msg.indexOf(",") !== -1) {
    clear();
    inLobby = false;
    let who = msg.substring(8).split(", ");
    for (let i = 0; i < who.length; i++) {
      if (who[i].includes("[") && i == who.length - 1) {
        addPlayer(who[i].slice(0, who[i].indexOf("[") - 1)); // Needed for Anti-Spam features in Clients that compact chat by adding [x3] etc.
        break;
      }
      addPlayer(who[i]);
    }
  } else if (msg.indexOf("has joined") !== -1 && msg.indexOf(":") === -1) {
    inLobby = false;
    addPlayer(msg.split(" ")[0]);
  } else if (msg.indexOf("has quit") !== -1 && msg.indexOf(":") === -1) {
    inLobby = false;
    removePlayer(msg.split(" ")[0]);
  } else if (msg.indexOf("Sending you") !== -1 && msg.indexOf(":") === -1) {
    inLobby = false;
    clear();
    if (dataStore.get("hideIngame") === true) {
      ipcRenderer.send("windowEvent", "show");
    }
  } else if ((msg.indexOf("joined the lobby!") !== -1 || msg.indexOf("rewards!") !== -1) && msg.indexOf(":") === -1) {
    if (inLobby == false) {
      clear();
      if (dataStore.get("hideIngame") === true) {
        ipcRenderer.send("windowEvent", "show");
      }
      inLobby = true;
    }
  } else if ((msg.indexOf("Party Leader:") === 0 || msg.indexOf("Party Members:") === 0 || msg.indexOf("Party Moderators:") === 0) && inLobby) {
    // '/pl' or '/p list' for Party stats
    let pmsg = msg.substring(msg.indexOf(":") + 2);
    let who = pmsg.split(" ");
    for (let i = 0; i < who.length; i++) {
      if (/^[a-zA-Z0-9_]+$/.test(who[i])) {
        addPlayer(updateStringCondition(who[i]), true);
      }
    }
  } else if (msg.indexOf("joined the party") !== -1 && msg.indexOf(":") === -1 && inLobby) {
    addPlayer(updateStringCondition(msg), true);
  } else if (msg.indexOf("left the party") !== -1 && msg.indexOf(":") === -1 && inLobby) {
    removePlayer(updateStringCondition(msg));
  } else if (msg.indexOf("You left the party") !== -1 && msg.indexOf(":") === -1 && inLobby) {
    clear();
  } else if (msg.indexOf("The party was disbanded") !== -1 && msg.indexOf(":") === -1 && inLobby) {
    clear();
  } else if ((msg.indexOf("FINAL KILL") !== -1 || msg.indexOf("disconnected") !== -1) && msg.indexOf(":") === -1) {
    inLobby = false;
    removePlayer(msg.split(" ")[0]);
  } else if (msg.indexOf("reconnected") !== -1 && msg.indexOf(":") === -1) {
    inLobby = false;
    addPlayer(msg.split(" ")[0]);
  } else if ((msg.indexOf("The game starts in 1 second!") !== -1 || msg.indexOf("The game is starting in 1 seconds!") !== -1 || msg.indexOf("The game is starting in 0 seconds!") !== -1) && msg.indexOf(":") === -1) {
    if (dataStore.get("hideIngame") === true) {
      ipcRenderer.send("windowEvent", "hide");
    }
  }
};

const getPlayers = () => {
  return players.sort((a, b) => b.level - a.level).sort((a, b) => Number(a.success) - Number(b.success));
};

var refreshing = false;

const refreshPlayers = () => {
  if (refreshing === false) {
    refreshing = true;
    for (const player of players) {
      addPlayer(player.username, true);
    }
    new Promise((r) => setTimeout(r, 1000)).then(() => {
      refreshing = false;
    });
  }
};

/**
 * @param {String} string
 * @returns
 * Check if "[" is present in string
 * If yes, update inputString with the second part of msg string separated by spaces
 * Useful when the user has no rank or no prefix is present in the returned string
 */
const updateStringCondition = (string) => {
  var inputString = string.split(" ")[0];
  if (inputString.indexOf("[") !== -1) {
    inputString = string.split(" ")[1];
  }
  return inputString;
};

export { parseMessage, getPlayers, addPlayer, refreshPlayers, clear };
