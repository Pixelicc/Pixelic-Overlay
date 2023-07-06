import dataStore from "../data/dataStore";

const homedir = dataStore.get("homedir");

const client = dataStore.get("client");

export default function () {
  if (client === "custom") {
    return dataStore.get("customLogFilePath");
  } else if (client === "lunar") {
    return `${homedir}/.lunarclient/offline/multiver/logs/latest.log`;
  } else if (client === "badlion") {
    return `${homedir}/AppData/Roaming/.minecraft/logs/blclient/minecraft/latest.log`;
  } else if (client === "vanilla") {
    return `${homedir}/AppData/Roaming/.minecraft/logs/latest.log`;
  }
}
