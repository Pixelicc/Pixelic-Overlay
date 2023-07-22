import dataStore from "../data/dataStore";
import axios from "axios";

var parsedBlacklist = [];

const updateLists = async () => {
  var lists = [];
  await axios
    .get("https://api.pixelic.de/hypixel/v1/overlay/reportsystem/list/personal", { headers: { "X-API-Key": dataStore.get("pixelicKey"), "cache-control": "no-cache" } })
    .then((res) => lists.push(res.data.reports))
    .catch(() => {});

  // TODO: Add other extra custom blacklist from other people

  var updatedLists = [];
  for (const list of lists) {
    for (const entry of list) {
      const checkForDuplicate = updatedLists.some((e) => e.suspect === entry.suspect);
      if (checkForDuplicate) {
        if (checkForDuplicate.reason === "sniper" && entry.reason === "cheater") {
          updatedLists[updatedLists.findIndex((e) => e.suspect === entry.suspect)].reason = "cheater";
        }
      } else {
        updatedLists.push(entry);
      }
    }
  }
  parsedBlacklist = updatedLists;
};

updateLists().then(() => {});

setInterval(async () => {
  await updateLists();
}, 60 * 1000);

export default {
  add: (UUID, reason) => {
    parsedBlacklist.push({ suspect: UUID, reason: reason });
  },
  remove: (UUID) => {
    parsedBlacklist = parsedBlacklist.filter((p) => p.suspect !== UUID);
  },
  check: (UUID) => {
    if (UUID === undefined) return null;
    if (parsedBlacklist.some((p) => p.suspect === UUID)) return parsedBlacklist.find((p) => p.suspect === UUID).reason;
    return null;
  },
};
