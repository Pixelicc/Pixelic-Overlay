import dataStore from "../electron/store";

var inLobby = true;
var players: Ref<any[]> = ref([]);
var playersInQueue: Ref<string[]> = ref([]);
var playersInParty: Ref<string[]> = ref([]);

const addPlayer = (player: string, options?: { force?: boolean; party?: boolean; mention?: boolean }) => {
  parseUUID(player).then(async (UUID) => {
    if (!options?.force && !inLobby) playersInQueue.value.push(player);
    if (options?.party) playersInParty.value.push(player);

    if (!UUID) {
      players.value.push({
        success: false,
        cause: "Invalid UUID",
        player: {
          UUID: null,
          username: player,
        },
      });
      removeDuplicates();
      return;
    }

    if (options?.force || !players.value.some((p) => p.player.username === player)) {
      const icons: { tooltip: string; color: string; name: string }[] = [];
      if (options?.party) icons.push({ tooltip: "Party", color: "indigo", name: "mdi-account-group" });
      if (options?.mention) icons.push({ tooltip: "This person mentioned you!", color: "yellow-lighten-3", name: "mdi-at" });

      const headers: { [key: string]: string } = {};

      const retries = ref(5);
      const retryDelay = ref(5000);

      const { data, error } = await useFetch(`${getAPIInstance()}/v2/pixelic-overlay/proxy/hypixel/player/${UUID}`, {
        headers: {
          "X-API-Key": dataStore.get("APIKey"),
        },
        retry: retries,
        retryDelay,
        async onResponse(context) {
          context.response.headers.forEach((value: string, key: string) => {
            headers[key] = value;
          });
        },
      });

      if (options?.force || (playersInQueue.value.includes(player) && inLobby !== true)) {
        if (error?.value) {
          if (error.value.statusCode === 429) {
            if (headers["X-RateLimit-Reset"]) {
              retryDelay.value = Number(headers["X-RateLimit-Reset"]) * 1000;
              sendNotification({ icon: "mdi-cloud-alert", text: `You are being ratelimited! New Players will appear in ${headers["X-RateLimit-Reset"]} seconds!`, color: "warning" });
            }

            return;
          }
          /**
           * Needed if there is an actual real Player called like a Hypixel Nickname but has never played on Hypixel themselves
           */
          if (error.value.statusCode === 404 && inLobby === false) error.value.data.cause = "Invalid UUID";
          const blacklistStatus = blacklistSystem.getStatus((data.value as any)?.UUID || "");
          players.value.push({
            player: {
              UUID: null,
              username: player,
            },
            blacklistStatus,
            headers,
            icons,
            tags:
              (error.value.data?.cause || "Invalid UUID") === "Invalid UUID"
                ? [{ text: "NICKED", tooltip: "This Player is hiding their real Name", color: getMCColor("e"), appendIcon: "mdi-incognito" }]
                : blacklistStatus?.reason
                ? [{ text: blacklistStatus?.reason === "CHEATING" ? "CHEATER" : "SNIPER", tooltip: "This Player is on one of your Blacklists", color: getMCColor("c"), appendIcon: "mdi-account-alert" }, ...tagSystem.getTags((data.value as any).player?.UUID || "")]
                : tagSystem.getTags((data.value as any).player?.UUID || ""),
            custom: {
              blacklistStatus,
              rankData: (error.value.data?.cause || "Invalid UUID") === "Invalid UUID" ? { full: "§e[NICK]", shortened: "§e" } : parseRank((data.value as any).player?.rank || null, (data.value as any).player?.plusColor || null, (data.value as any).player?.plusPlusColor || null),
            },
          });
        } else {
          const blacklistStatus = blacklistSystem.getStatus((data.value as any)?.UUID || "");
          players.value.push({
            ...(data.value as any),
            blacklistStatus,
            headers,
            icons,
            tags:
              (data.value as any).cause === "Invalid UUID"
                ? [{ text: "NICKED", tooltip: "This Player is hiding their real Name", color: getMCColor("e"), appendIcon: "mdi-incognito" }]
                : blacklistStatus?.reason
                ? [{ text: blacklistStatus?.reason === "CHEATING" ? "CHEATER" : "SNIPER", tooltip: "This Player is on one of your Blacklists", color: getMCColor("c"), appendIcon: "mdi-account-alert" }, ...tagSystem.getTags((data.value as any).player?.UUID || "")]
                : tagSystem.getTags((data.value as any).player?.UUID || ""),
            custom: {
              blacklistStatus,
              rankData: (data.value as any).cause === "Invalid UUID" ? { full: "§e[NICK]", shortened: "§e" } : parseRank((data.value as any).player?.rank || null, (data.value as any).player?.plusColor || null, (data.value as any).player?.plusPlusColor || null),
            },
          });
        }
      }
    }
    removeDuplicates();
  });
};

var refreshing = false;

const refreshPlayers = () => {
  if (refreshing === false) {
    refreshing = true;
    for (const player of players.value) {
      addPlayer(player.player.username, { force: true });
    }
    console.log(`%c[PlayerHandler] Refreshed ${players.value.length} Players`, "color: #d09292");
    setTimeout(() => {
      refreshing = false;
    }, 1000);
  }
};

const removePlayer = (player: string) => {
  playersInQueue.value = playersInQueue.value.filter((p) => {
    return p !== player;
  });
  playersInParty.value = playersInParty.value.filter((p) => {
    return p !== player;
  });
  players.value = players.value.filter((p) => {
    return p.player.username !== player;
  });
};

const removeDuplicates = () => {
  playersInQueue.value = [...new Set(playersInQueue.value)];
  playersInParty.value = [...new Set(playersInParty.value)];
  players.value = [...new Map(players.value.map((player: any) => [player.player.username.toLowerCase(), player])).values()];
};

const clearPlayers = () => {
  console.log(`%c[PlayerHandler] Cleared ${players.value.length - 1} Players`, "color: #d09292");
  players.value = [];
  playersInQueue.value = [];
  playersInParty.value = [];
  addPlayer(dataStore.get("player"), { force: true });
};

const getInLobby = () => inLobby;
const setInLobby = (bool: boolean) => {
  if (bool !== inLobby) {
    console.log(`%c[PlayerHandler] Player now located ${bool ? "in the Lobby" : "in a Minigame"}`, "color: #d09292");
    inLobby = bool;
  }
};
const getPlayers = () => players.value;
const getPlayersInQueue = () => playersInQueue.value;
const getPlayersInParty = () => playersInParty.value;

export default {
  getInLobby,
  setInLobby,
  getPlayers,
  getPlayersInQueue,
  getPlayersInParty,
  addPlayer,
  refreshPlayers,
  removePlayer,
  clearPlayers,
  players,
};
