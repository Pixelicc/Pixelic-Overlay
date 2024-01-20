import { ipcRenderer } from "electron";
import dataStore from "../electron/store.js";

export default defineNuxtPlugin({
  name: "misc",
  enforce: "post",
  hooks: {
    "app:created"() {
      console.log(`%c[Pixelic-Overlay] Loaded in ${process.env.VITE_DEV_SERVER_URL ? "DEV" : "PROD"} Mode`, "color: #c094cc");

      if (dataStore.get("APIKey").length === 0) {
        ipcRenderer.send("link", "https://discord.com/api/oauth2/authorize?client_id=1176611079560904744&response_type=code&redirect_uri=https%3A%2F%2Fapi.pixelic.de%2Foauth%2Fdiscord%3Faction%3Duser.create&scope=identify");
        navigateTo("/settings/general");
      }

      ipcRenderer.send("window", dataStore.get("windowLocation"));
      ipcRenderer.on("mcChatMessage", (event, msg) => {
        messageHandler.submitMessage(msg);
      });

      playerHandler.addPlayer(dataStore.get("player"), { force: true });
      if (dataStore.get("discordRPC") === true) {
        console.log(`%c[DiscordRPC] Connecting to socket...`, "color: #c37892");
        parseUUID(dataStore.get("player")).then((UUID) => ipcRenderer.send("discordRPCInit", UUID));
      }

      tagSystem.updateTags();
      setInterval(() => tagSystem.updateTags(), 300 * 1000);

      blacklistSystem.updatePersonalBlacklist();
      setInterval(() => blacklistSystem.updatePersonalBlacklist(), 300 * 1000);

      blacklistSystem.updatePersonalBlacklist();
      setInterval(() => blacklistSystem.updatePersonalBlacklist(), 300 * 1000);

      (document.querySelector(":root") as HTMLElement).style.setProperty("--opacity", dataStore.get("opacity"));
    },
  },
});
