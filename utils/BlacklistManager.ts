import dataStore from "../electron/store";

const personalBlacklist: Ref<{
  [key: string]: {
    reason: string;
    timestamp: number;
  };
}> = ref({});

const customBlacklists: Ref<
  {
    [key: string]: {
      reason: string;
      timestamp: number;
    };
  }[]
> = ref([]);

const updatePersonalBlacklist = async () => {
  if (dataStore.get("blacklistSettings").blacklists.some((blacklist) => blacklist.type === "PERSONAL" && blacklist.enabled)) {
    const timer = Date.now();
    const { data } = await PixelicAPI("/v2/pixelic-overlay/blacklist/personal");
    if (data?.value) {
      console.log(`%c[BlacklistManager] Synced Personal Blacklist in ${Date.now() - timer}ms`, "color: #a4b6dd");
      personalBlacklist.value = (data.value as any)?.entries || {};
    } else {
      console.error("%c[BlacklistManager] Failed syncing Personal Blacklist", "color: #a4b6dd");
    }
  }
};

const updateCustomBlacklists = async () => {
  var blacklists = dataStore.get("blacklistSettings").blacklists;

  if (blacklists.length > 1) {
    blacklists = blacklists.filter((blacklist) => blacklist.type !== "PERSONAL" && blacklist.enabled);
    const fetchedBlacklists: {
      [key: string]: {
        reason: string;
        timestamp: number;
      };
    }[] = [];

    const timer = Date.now();
    for (const blacklist of blacklists) {
      const { data } = await PixelicAPI(`/v2/pixelic-overlay/blacklist/${blacklist.ID}`);
      if (data?.value) {
        fetchedBlacklists.push((data.value as any)?.entries || {});
      } else {
        console.error(`%c[BlacklistManager] Failed syncing extra Blacklist (ID: ${blacklist.ID})`, "color: #a4b6dd");
      }
    }
    console.log(`%c[BlacklistManager] Synced extra Blacklists in ${Date.now() - timer}ms`, "color:	#a4b6dd");
    customBlacklists.value = fetchedBlacklists;
  }
};

const getPlayerBlacklistStatus = (UUID: string): { personal?: boolean; reason?: string; timestamp?: number } => {
  if (Object.hasOwn(personalBlacklist.value, formatUUID(UUID))) return { personal: true, ...personalBlacklist.value?.[formatUUID(UUID)] };
  const customQuery = customBlacklists.value.find((blacklist) => Object.hasOwn(blacklist, formatUUID(UUID)));
  if (!customQuery) return {};
  return { personal: false, ...customQuery[formatUUID(UUID)] };
};

const removeEntries = async (UUIDs: string[]) => {
  const timer = Date.now();
  const { data } = await PixelicAPI("/v2/pixelic-overlay/blacklist/personal", {
    method: "DELETE",
    body: JSON.stringify(UUIDs),
  });
  if (data?.value) {
    console.log(`%c[BlacklistManager] Removed ${UUIDs.length === 1 ? UUIDs[0] : UUIDs.join(", ")} from your Personal Blacklist in ${Date.now() - timer}ms`, "color: #a4b6dd");
    sendNotification({ icon: "mdi-database-minus", text: "Successfully removed the player(s) from your Personal Blacklist!", color: "success" });
    for (const UUID of UUIDs) {
      delete personalBlacklist.value[UUID];
    }
  } else {
    console.error(`%c[BlacklistManager] Failed removing ${UUIDs.length === 1 ? UUIDs[0] : UUIDs.join(", ")} from your Personal Blacklist`, "color: #a4b6dd");
    sendNotification({ icon: "mdi-database-alert", text: "An error occured whilst trying to remove the Player(s) from your Personal Blacklist!", color: "error" });
  }
};

const addEntry = async (player: string, reason: "CHEATING" | "SNIPING"): Promise<void> => {
  const timer = Date.now();
  const UUID = await parseUUID(player);
  const { data } = await PixelicAPI("/v2/pixelic-overlay/blacklist/personal", {
    method: "POST",
    body: JSON.stringify({ UUID, reason }),
  });
  if (data?.value && UUID) {
    console.log(`%c[BlacklistManager] Added ${player} to your Personal Blacklist in ${Date.now() - timer}ms`, "color: #a4b6dd");
    sendNotification({ icon: "mdi-database-plus", text: "Successfully added this Player to your Personal Blacklist!", color: "success" });
    personalBlacklist.value[UUID] = { reason, timestamp: Math.floor(Date.now() / 1000) };
  } else {
    console.error(`%c[BlacklistManager] Failed adding ${player} to your Personal Blacklist`, "color: #a4b6dd");
    sendNotification({ icon: "mdi-database-alert", text: "An error occured whilst trying to add this Player to your Personal Blacklist!", color: "error" });
  }
};

export default {
  updatePersonalBlacklist,
  updateCustomBlacklists,
  personalBlacklist,
  customBlacklists,
  getPlayerBlacklistStatus,
  removeEntries,
  addEntry,
};
