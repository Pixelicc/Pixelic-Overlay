import { ipcRenderer } from "electron";
import dataStore from "../electron/store.js";

export default defineNuxtPlugin({
  name: "misc",
  enforce: "post",
  hooks: {
    "app:created"() {
      ipcRenderer.send("window", dataStore.get("windowLocation"));
      ipcRenderer.on("window", (event, msg) => {
        if (typeof msg === "object" && Object.keys(msg).length !== 0) dataStore.set("window", msg);
      });

      ipcRenderer.on("mcChatMessage", (event, msg) => {
        messageHandler.submitMessage(msg);
      });

      playerHandler.addPlayer(dataStore.get("player"), { force: true });
      if (dataStore.get("discordRPC") === true) parseUUID(dataStore.get("player")).then((UUID) => ipcRenderer.send("discordRPCInit", UUID));

      (document.querySelector(":root") as HTMLElement).style.setProperty("--opacity", dataStore.get("opacity"));
    },
  },
});
