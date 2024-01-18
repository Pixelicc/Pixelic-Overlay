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
    const { data } = await useFetch(`${process.env.VITE_DEV_SERVER_URL ? "http://localhost:3000" : "https://api.pixelic.de"}/v2/pixelic-overlay/blacklist/personal`, {
      headers: {
        "X-API-Key": dataStore.get("pixelicKey"),
      },
    });
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

    for (const blacklist of blacklists) {
      const { data } = await useFetch(`${process.env.VITE_DEV_SERVER_URL ? "http://localhost:3000" : "https://api.pixelic.de"}/v2/pixelic-overlay/blacklist/${blacklist.ID}`, {
        headers: {
          "X-API-Key": dataStore.get("pixelicKey"),
        },
      });
      if (data.value) {
        fetchedBlacklists.push((data.value as any)?.entries || {});
      }
    }
    customBlacklists = fetchedBlacklists;
  }
};
updateCustomBlacklists();
setInterval(() => updateCustomBlacklists(), 300 * 1000);

const getStatus = (UUID: string): { reason?: string; timestamp?: number } => {
  if (Object.hasOwn(personalBlacklist, formatUUID(UUID))) return personalBlacklist?.[formatUUID(UUID)];
  const customQuery = customBlacklists.find((blacklist) => Object.hasOwn(blacklist, formatUUID(UUID)));
  if (!customQuery) return {};
  return customQuery[formatUUID(UUID)];
};

const getPersonalBlacklist = () => personalBlacklist;

const removeEntries = async (UUIDs: string[]) => {
  const { data, error } = await useFetch("http://localhost:3000/v2/pixelic-overlay/blacklist/personal", {
    method: "delete",
    body: JSON.stringify(UUIDs),
    headers: {
      "X-API-Key": dataStore.get("pixelicKey"),
    },
  });
};

export default {
  updatePersonalBlacklist,
  getStatus,
  getPersonalBlacklist,
  removeEntries,
};
