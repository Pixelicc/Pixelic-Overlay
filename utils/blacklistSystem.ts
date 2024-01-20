import dataStore from "../electron/store";

var personalBlacklist: {
  [key: string]: {
    reason: string;
    timestamp: number;
  };
} = {};

var customBlacklists: {
  [key: string]: {
    reason: string;
    timestamp: number;
  };
}[] = [];

const updatePersonalBlacklist = async () => {
  if (dataStore.get("blacklists").some((blacklist) => blacklist.type === "PERSONAL" && blacklist.enabled)) {
    const timer = Date.now();
    const { data } = await useFetch(`${getAPIInstance()}/v2/pixelic-overlay/blacklist/personal`, {
      headers: {
        "X-API-Key": dataStore.get("APIKey"),
      },
    });
    if (data?.value) {
      console.log(`%c[BlacklistSystem] Synced Personal Blacklist in ${Date.now() - timer}ms`, "color: #a4b6dd");
      personalBlacklist = (data.value as any)?.entries || {};
    } else {
      console.error("%c[BlacklistSystem] Failed syncing Personal Blacklist", "color: #a4b6dd");
    }
  }
};

const updateCustomBlacklists = async () => {
  var blacklists = dataStore.get("blacklists");

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
      const { data } = await useFetch(`${getAPIInstance()}/v2/pixelic-overlay/blacklist/${blacklist.ID}`, {
        headers: {
          "X-API-Key": dataStore.get("APIKey"),
        },
      });
      if (data?.value) {
        fetchedBlacklists.push((data.value as any)?.entries || {});
      } else {
        console.error(`%c[BlacklistSystem] Failed syncing extra Blacklist (ID: ${blacklist.ID})`, "color: #a4b6dd");
      }
    }
    console.log(`%c[BlacklistSystem] Synced extra Blacklists in ${Date.now() - timer}ms`, "color:	#a4b6dd");
    customBlacklists = fetchedBlacklists;
  }
};

const getStatus = (UUID: string): { personal?: boolean; reason?: string; timestamp?: number } => {
  if (Object.hasOwn(personalBlacklist, formatUUID(UUID))) return { personal: true, ...personalBlacklist?.[formatUUID(UUID)] };
  const customQuery = customBlacklists.find((blacklist) => Object.hasOwn(blacklist, formatUUID(UUID)));
  if (!customQuery) return {};
  return { personal: false, ...customQuery[formatUUID(UUID)] };
};

const getPersonalBlacklist = () => personalBlacklist;

const removeEntries = async (UUIDs: string[]) => {
  const timer = Date.now();
  const { data } = await useFetch(`${getAPIInstance()}/v2/pixelic-overlay/blacklist/personal`, {
    method: "delete",
    body: JSON.stringify(UUIDs),
    headers: {
      "X-API-Key": dataStore.get("APIKey"),
    },
  });
  if (data?.value) {
    console.log(`%c[BlacklistSystem] Removed ${UUIDs.length === 1 ? UUIDs[0] : UUIDs.join(", ")} from your Personal Blacklist in ${Date.now() - timer}ms`, "color: #a4b6dd");
    sendNotification({ icon: "mdi-database-minus", text: "Successfully removed the player(s) from your Personal Blacklist!", color: "success" });
    for (const UUID of UUIDs) {
      delete personalBlacklist[UUID];
    }
  } else {
    console.error(`%c[BlacklistSystem] Failed removing ${UUIDs.length === 1 ? UUIDs[0] : UUIDs.join(", ")} from your Personal Blacklist`, "color: #a4b6dd");
    sendNotification({ icon: "mdi-database-alert", text: "An error occured whilst trying to remove the Player(s) from your Personal Blacklist!", color: "error" });
  }
};

const addEntry = async (player: string, reason: "CHEATING" | "SNIPING"): Promise<void> => {
  const timer = Date.now();
  const UUID = await parseUUID(player);
  const { data } = await useFetch(`${getAPIInstance()}/v2/pixelic-overlay/blacklist/personal`, {
    method: "post",
    body: JSON.stringify({ UUID, reason }),
    headers: { "X-API-Key": dataStore.get("APIKey") },
  });
  if (data?.value && UUID) {
    console.log(`%c[BlacklistSystem] Added ${player} to your Personal Blacklist in ${Date.now() - timer}ms`, "color: #a4b6dd");
    sendNotification({ icon: "mdi-database-plus", text: "Successfully added this Player to your Personal Blacklist!", color: "success" });
    personalBlacklist[UUID] = { reason, timestamp: Math.floor(Date.now() / 1000) };
  } else {
    console.error(`%c[BlacklistSystem] Failed adding ${player} to your Personal Blacklist`, "color: #a4b6dd");
    sendNotification({ icon: "mdi-database-alert", text: "An error occured whilst trying to add this Player to your Personal Blacklist!", color: "error" });
  }
};

export default {
  updatePersonalBlacklist,
  getStatus,
  getPersonalBlacklist,
  removeEntries,
  addEntry,
};
