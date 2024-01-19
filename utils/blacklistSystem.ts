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
    console.log(`%c[BlacklistSystem] Synced Personal Blacklist in ${Date.now() - timer}ms`, "color: #a4b6dd");
    if (data.value) {
      personalBlacklist = (data.value as any)?.entries || {};
    }
  }
};
updatePersonalBlacklist();
setInterval(() => updatePersonalBlacklist(), 300 * 1000);

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
      if (data.value) {
        fetchedBlacklists.push((data.value as any)?.entries || {});
      }
    }
    console.log(`%c[BlacklistSystem] Synced extra Blacklists in ${Date.now() - timer}ms`, "color:	#a4b6dd");
    customBlacklists = fetchedBlacklists;
  }
};
updateCustomBlacklists();
setInterval(() => updateCustomBlacklists(), 300 * 1000);

const getStatus = (UUID: string): { personal?: boolean; reason?: string; timestamp?: number } => {
  if (Object.hasOwn(personalBlacklist, formatUUID(UUID))) return { personal: true, ...personalBlacklist?.[formatUUID(UUID)] };
  const customQuery = customBlacklists.find((blacklist) => Object.hasOwn(blacklist, formatUUID(UUID)));
  if (!customQuery) return {};
  return { personal: false, ...customQuery[formatUUID(UUID)] };
};

const getPersonalBlacklist = () => personalBlacklist;

const removeEntries = async (UUIDs: string[]) => {
  const timer = Date.now();
  const { data, error } = await useFetch("http://localhost:3000/v2/pixelic-overlay/blacklist/personal", {
    method: "delete",
    body: JSON.stringify(UUIDs),
    headers: {
      "X-API-Key": dataStore.get("APIKey"),
    },
  });
  console.log(`%c[BlacklistSystem] Removed ${UUIDs.join(", ")} from your Personal Blacklist in ${Date.now() - timer}ms`, "color: #a4b6dd");
  updatePersonalBlacklist();
};

const addEntry = async (player: string, reason: "CHEATING" | "SNIPING"): Promise<void> => {
  try {
    const timer = Date.now();
    const UUID = await parseUUID(player);
    const { data, error } = await useFetch(`${getAPIInstance()}/v2/pixelic-overlay/blacklist/personal`, { method: "post", body: JSON.stringify({ UUID, reason }), headers: { "X-API-Key": dataStore.get("APIKey") } });
    console.log(`%c[BlacklistSystem] Added ${player} to your Personal Blacklist in ${Date.now() - timer}ms`, "color: #a4b6dd");
    updatePersonalBlacklist();
  } catch {}
};

export default {
  updatePersonalBlacklist,
  getStatus,
  getPersonalBlacklist,
  removeEntries,
  addEntry,
};
