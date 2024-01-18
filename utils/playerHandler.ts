import dataStore from "../electron/store";

var inLobby = true;
var players: any[] = [];
var playersInQueue: string[] = [];
var playersInParty: string[] = [];

const addPlayer = (player: string, options?: { force?: boolean; party?: boolean; mention?: boolean }) => {
  parseUUID(player).then(async (UUID) => {
    if (!options?.force && !inLobby) playersInQueue.push(player);
    if (options?.party) playersInParty.push(player);

    if (!UUID) {
      players.push({
        success: false,
        cause: "Invalid UUID or Username",
        player: {
          UUID: null,
          username: player,
        },
      });
      removeDuplicates();
      return;
    }

    if (options?.force || !players.some((p) => p.player.username === player)) {
      const icons: { tooltip: string; color: string; name: string }[] = [];
      if (options?.party) icons.push({ tooltip: "Party", color: "indigo", name: "mdi-account-group" });
      if (options?.mention) icons.push({ tooltip: "This person mentioned you!", color: "yellow-lighten-3", name: "mdi-at" });

      const headers: { [key: string]: string } = {};

      const { data, error } = await useFetch(`${process.env.VITE_DEV_SERVER_URL ? "http://localhost:3000" : "https://api.pixelic.de"}/v2/pixelic-overlay/proxy/hypixel/player/${UUID}`, {
        headers: {
          "X-API-Key": dataStore.get("pixelicKey"),
        },
        async onResponse(context) {
          context.response.headers.forEach((value: string, key: string) => {
            headers[key] = value;
          });
        },
      });
      if (options?.force || (playersInQueue.includes(player) && inLobby !== true)) {
        if (error.value) {
          if (error.value.statusCode === 429) {
            return;
          }
          /**
           * Needed if there is an actual real Player called like a Hypixel Nickname but has never played on Hypixel themselves
           */
          if (error.value.statusCode === 404 && inLobby === false) error.value.data.cause = "Invalid UUID";
          players.push({
            success: false,
            cause: error.value.data.cause,
            headers,
            icons,
            player: {
              UUID: null,
              username: player,
            },
          });
        } else {
          players.push({ ...(data.value as any), headers, icons });
        }
      }
    }
    removeDuplicates();
  });
};

const reportPlayer = async (player: string, reason: "CHEATING" | "SNIPING"): Promise<void> => {
  try {
    const UUID = await parseUUID(player);

    const { data, error } = await useFetch(`http://localhost:3000/v2/pixelic-overlay/blacklist/personal`, { method: "post", body: JSON.stringify({ UUID, reason }), headers: { "X-API-Key": dataStore.get("pixelicKey") } });
  } catch {}
};

var refreshing = false;

const refreshPlayers = () => {
  if (refreshing === false) {
    refreshing = true;
    for (const player of players) {
      addPlayer(player.player.username, { force: true });
    }
    setTimeout(() => {
      refreshing = false;
    }, 1000);
  }
};

const removePlayer = (player: string) => {
  playersInQueue = playersInQueue.filter((p) => {
    return p !== player;
  });
  playersInParty = playersInParty.filter((p) => {
    return p !== player;
  });
  players = players.filter((p) => {
    return p.player.username !== player;
  });
};

const removeDuplicates = () => {
  playersInQueue = [...new Set(playersInQueue)];
  playersInParty = [...new Set(playersInParty)];
  players = [...new Map(players.map((player: any) => [player.player.username.toLowerCase(), player])).values()];
};

const clearPlayers = () => {
  players = [];
  playersInQueue = [];
  playersInParty = [];
  addPlayer(dataStore.get("player"), { force: true });
};

const getInLobby = () => inLobby;
const setInLobby = (bool: boolean) => {
  inLobby = bool;
};
const getPlayers = () => players;
const getPlayersInQueue = () => playersInQueue;
const getPlayersInParty = () => playersInParty;

export default {
  getInLobby,
  setInLobby,
  getPlayers,
  getPlayersInQueue,
  getPlayersInParty,
  addPlayer,
  reportPlayer,
  refreshPlayers,
  removePlayer,
  clearPlayers,
};
