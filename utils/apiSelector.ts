import dataStore from "../electron/store";

export const getAPIInstance = () => {
  if (dataStore.get("advancedMode") && dataStore.get("APIInstance").length !== 0) {
    return dataStore.get("APIInstance");
  }
  return process.env.VITE_DEV_SERVER_URL ? "http://localhost:3000" : "https://api.pixelic.de";
};
