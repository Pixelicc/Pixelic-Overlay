import dataStore from "../electron/store";

var inLobby = ref(true);
var players: Ref<any[]> = ref([]);
var playersInQueue: Ref<string[]> = ref([]);
var playersInParty: Ref<string[]> = ref([]);

const addPlayer = (player: string, options?: { force?: boolean; party?: boolean; mention?: boolean }) => {
  parseUUID(player).then(async (UUID) => {
    if (!options?.force && !inLobby.value) playersInQueue.value.push(player);
    if (options?.party) playersInParty.value.push(player);

    if (!UUID) {
      players.value.push({
        player: {
          UUID: null,
          username: player,
        },
        headers: [],
        icons: [],
        tags: [{ text: "NICKED", tooltip: "This Player is hiding their real Name", color: getMCColor("e"), appendIcon: "mdi-incognito" }],
        custom: {
          blacklistStatus: {},
          rankData: { full: "§e[NICK]", shortened: "§e" },
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

      const { data, error } = await PixelicAPI(`/v2/pixelic-overlay/proxy/hypixel/player/${UUID}`, {
        retry: 5,
        retryDelay: 20000,
        async onResponse(context) {
          context.response.headers.forEach((value: string, key: string) => {
            headers[key] = value;
          });
        },
      });

      if (options?.force || (playersInQueue.value.includes(player) && inLobby.value !== true)) {
        if (error?.value) {
          /**
           * Needed if there is an actual real Player called like a Hypixel Nickname but has never played on Hypixel themselves
           */
          if (error.value.statusCode === 404 && inLobby.value === false) error.value.data.cause = "Invalid UUID";
          const blacklistStatus = BlacklistManager.getPlayerBlacklistStatus((data.value as any)?.player?.UUID || "");

          players.value.push({
            player: {
              UUID: null,
              username: player,
            },
            headers,
            icons,
            tags:
              (error.value.data?.cause || "Invalid UUID") === "Invalid UUID"
                ? [{ text: "NICKED", tooltip: "This Player is hiding their real Name", color: getMCColor("e"), appendIcon: "mdi-incognito" }]
                : blacklistStatus?.reason
                ? [{ text: blacklistStatus?.reason === "CHEATING" ? "CHEATER" : "SNIPER", tooltip: "This Player is on one of your Blacklists", color: getMCColor("c"), appendIcon: "mdi-account-alert" }, ...TagManager.getPlayerTags((data.value as any).player?.UUID || "")]
                : TagManager.getPlayerTags((data.value as any).player?.UUID || ""),
            custom: {
              blacklistStatus,
              rankData: (error.value.data?.cause || "Invalid UUID") === "Invalid UUID" ? { full: "§e[NICK]", shortened: "§e" } : parseRank((data.value as any).player?.rank || null, (data.value as any).player?.plusColor || null, (data.value as any).player?.plusPlusColor || null),
            },
          });
        } else {
          const blacklistStatus = BlacklistManager.getPlayerBlacklistStatus((data.value as any)?.player?.UUID || "");
          players.value.push({
            ...(data.value as any),
            headers,
            icons,
            tags:
              (data.value as any).cause === "Invalid UUID"
                ? [{ text: "NICKED", tooltip: "This Player is hiding their real Name", color: getMCColor("e"), appendIcon: "mdi-incognito" }]
                : blacklistStatus?.reason
                ? [{ text: blacklistStatus?.reason === "CHEATING" ? "CHEATER" : "SNIPER", tooltip: "This Player is on one of your Blacklists", color: getMCColor("c"), appendIcon: "mdi-account-alert" }, ...TagManager.getPlayerTags((data.value as any).player?.UUID || "")]
                : TagManager.getPlayerTags((data.value as any).player?.UUID || ""),
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
    console.log(`%c[PlayerManager] Refreshed ${players.value.length} Player(s)`, "color: #d09292");
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
  players.value = [...new Map(players.value.map((player: any) => [player.player?.username?.toLowerCase(), player])).values()];
};

const clearPlayers = () => {
  if (players.value.length > 1) console.log(`%c[PlayerManager] Cleared ${players.value.length - 1} Player(s)`, "color: #d09292");
  players.value = [];
  playersInQueue.value = [];
  playersInParty.value = [];
  addPlayer(dataStore.get("overlaySettings").username, { force: true });
};

export default {
  inLobby,
  players,
  playersInQueue,
  playersInParty,
  addPlayer,
  refreshPlayers,
  removePlayer,
  clearPlayers,
};
