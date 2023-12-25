import { BrowserWindow, app } from "electron";
import log from "electron-log";
import fs from "fs";
// @ts-ignore
import * as Tail from "tail";

var isTailing = false;
var tail: any;

const initTailing = ({ win, client, customLogPath }: { win: BrowserWindow; client: string; customLogPath: string }) => {
  var path = customLogPath;

  if (client === "LUNAR") {
    path = `${app.getPath("home").replace(/\\/g, "/")}/.lunarclient/offline/multiver/logs/latest.log`;
  } else if (client === "BADLION") {
    if (process.platform === "win32") {
      path = `${app.getPath("appData").replace(/\\/g, "/")}/.minecraft/logs/blclient/minecraft/latest.log`;
    } else if (process.platform === "darwin") {
      path = `${app.getPath("home").replace(/\\/g, "/")}/Library/Application Support/minecraft/logs/blclient/minecraft/latest.log`;
    } else if (process.platform === "linux") {
      path = `${app.getPath("home").replace(/\\/g, "/")}/.minecraft/logs/blclient/minecraft/latest.log`;
    }
  } else if (client === "DEFAULT") {
    if (process.platform === "win32") {
      path = `${app.getPath("appData").replace(/\\/g, "/")}/.minecraft/logs/latest.log`;
    } else if (process.platform === "darwin") {
      path = `${app.getPath("home").replace(/\\/g, "/")}/Library/Application Support/minecraft/logs/latest.log`;
    } else if (process.platform === "linux") {
      path = `${app.getPath("home").replace(/\\/g, "/")}/.minecraft/logs/latest.log`;
    }
  }

  log.info(`Selected Client: ${client} | Choosen Path: ${path}`);

  if (fs.existsSync(path)) {
    tail = new Tail.Tail(path, {
      useWatchFile: true,
      nLines: 1,
      fsWatchOptions: { interval: 100 },
    });

    isTailing = true;

    tail.on("line", (line: string) => {
      const chatIndex = line.indexOf("[CHAT]");
      if (chatIndex !== -1) {
        const msg = line.substring(chatIndex + 7).replace(/(§|�)([0-9]|a|b|e|d|f|k|l|m|n|o|r|c)/gm, "");
        win.webContents.send("mcChatMessage", msg);
      }
    });
  }
};

const stopTailing = () => {
  if (isTailing) tail.unwatch();
};

export default {
  initTailing,
  stopTailing,
};
