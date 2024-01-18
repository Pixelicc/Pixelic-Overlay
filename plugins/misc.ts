import { ipcRenderer } from "electron";
import dataStore from "../electron/store.js";

export default defineNuxtPlugin({
  name: "misc",
  enforce: "post",
  hooks: {
    "app:created"() {
      console.log(`%c[Pixelic-Overlay] Loaded in ${process.env.VITE_DEV_SERVER_URL ? "DEV" : "PROD"} Mode`, "color: #c094cc");

      ipcRenderer.send("window", dataStore.get("windowLocation"));
      ipcRenderer.on("mcChatMessage", (event, msg) => {
        messageHandler.submitMessage(msg);
      });

      playerHandler.addPlayer(dataStore.get("player"), { force: true });
      if (dataStore.get("discordRPC") === true) {
        console.log(`%c[DiscordRPC] Connecting to socket...`, "color: #c37892");
        parseUUID(dataStore.get("player")).then((UUID) => ipcRenderer.send("discordRPCInit", UUID));
      }

      (document.querySelector(":root") as HTMLElement).style.setProperty("--opacity", dataStore.get("opacity"));
    },
  },
});
