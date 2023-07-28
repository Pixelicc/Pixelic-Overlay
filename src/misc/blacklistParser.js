import dataStore from "../data/dataStore";
import axios from "axios";

var personalBlacklist = [];

const updatePersonalBlacklist = async () => {
  var updatedList = [];
  await axios
    .get("https://api.pixelic.de/hypixel/v1/overlay/reportsystem/list/personal", { headers: { "X-API-Key": dataStore.get("pixelicKey"), "cache-control": "no-cache" } })
    .then((res) => {
      updatedList = res.data.reports;
    })
    .catch(() => {});
  personalBlacklist = updatedList;
};

var globalBlacklist = [];

const updateGlobalBlacklist = async () => {
  var updatedList = [];
  await axios
    .get("https://api.pixelic.de/hypixel/v1/overlay/reportsystem/list/global", { headers: { "X-API-Key": dataStore.get("pixelicKey"), "cache-control": "no-cache" } })
    .then((res) => {
      updatedList = res.data.reports;
    })
    .catch(() => {});
  globalBlacklist = updatedList;
};

const updateLists = () => {
  if (dataStore.get("blacklists").some((l) => l.name === "Personal" && l.enabled === true)) updatePersonalBlacklist();
  if (dataStore.get("blacklists").some((l) => l.name === "Global" && l.enabled === true)) updateGlobalBlacklist();
};

updateLists();
setInterval(() => {
  updateLists();
}, 60 * 1000);

export default {
  add: (UUID, reason) => {
    personalBlacklist.push({ suspect: UUID, reason: reason });
  },
  remove: (UUID) => {
    personalBlacklist = personalBlacklist.filter((p) => p.suspect !== UUID);
  },
  check: (UUID) => {
    if (UUID === undefined) return null;
    if (dataStore.get("blacklists").some((l) => l.name === "Personal" && l.enabled === true) && personalBlacklist.some((p) => p.suspect === UUID)) return personalBlacklist.find((p) => p.suspect === UUID).reason;
    if (dataStore.get("blacklists").some((l) => l.name === "Global" && l.enabled === true) && globalBlacklist.some((p) => p.suspect === UUID)) return globalBlacklist.find((p) => p.suspect === UUID).reason;
    return null;
  },
};
