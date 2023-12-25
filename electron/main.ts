import { app, BrowserWindow, ipcMain, shell } from "electron";
import log from "electron-log";
import { autoUpdater } from "electron-updater";
import Store from "electron-store";
import fs from "fs";
import path from "path";
import dataStore from "./store";
import mcLog from "./scripts/mcLog";
import discordRPC from "./scripts/discordRPC";

process.env.ROOT = path.join(__dirname, "..");
process.env.DIST = path.join(process.env.ROOT, "dist-electron");
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL ? path.join(process.env.ROOT, "public") : path.join(process.env.ROOT, ".output/public");
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

autoUpdater.logger = log;

Store.initRenderer();

app.whenReady().then(() => {
  autoUpdater.disableWebInstaller = true;
  autoUpdater.checkForUpdatesAndNotify();

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 600,
    minHeight: 400,

    autoHideMenuBar: true,
    alwaysOnTop: true,
    frame: false,
    transparent: true,
    hasShadow: process.platform !== "darwin",

    webPreferences: {
      nodeIntegrationInWorker: true,
      contextIsolation: false,
      nodeIntegration: true,
      webSecurity: false,
    },
  });

  var isFirstLoad = true;

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
    log.info("Loading Nuxt-App in Dev-Mode...");
  } else {
    win.loadFile(path.join(process.env.VITE_PUBLIC!, "index.html"));
    log.info("Loading bundled Nuxt-App...");
  }

  win.webContents.on("dom-ready", () => {
    if (isFirstLoad) {
      isFirstLoad = false;
      return;
    }
    win.webContents.send("window", win.getBounds());
    isFirstLoad = true;
    setTimeout(() => {
      isFirstLoad = false;
    }, 10 * 1000);
    if (process.env.VITE_DEV_SERVER_URL) {
      win.loadURL(process.env.VITE_DEV_SERVER_URL);
      log.info("Reloading Nuxt-App in Dev-Mode...");
    } else {
      win.loadFile(path.join(process.env.VITE_PUBLIC!, "index.html"));
      log.info("Reloading bundled Nuxt-App...");
    }
  });

  mcLog.initTailing({ win, client: dataStore.get("client"), customLogPath: dataStore.get("customLogPath") });

  win.on("resize", () => {
    const width = win.getContentSize()[0];
    if (width < 700) {
      win.webContents.setZoomFactor(0.7);
    } else if (width < 800) {
      win.webContents.setZoomFactor(0.8);
    } else if (width < 900) {
      win.webContents.setZoomFactor(0.9);
    } else {
      win.webContents.setZoomFactor(1);
    }
  });

  ipcMain.on("window", (event, msg) => {
    if (typeof msg === "object" && Object.keys(msg).length !== 0) {
      win.setBounds(msg);
    } else {
      switch (msg) {
        case "minimize":
          win.minimize();
        case "close":
          win.close();
        case "hide":
          win.hide();
        case "show":
          win.show();
      }
    }
  });

  ipcMain.on("link", (event, msg) => {
    if (typeof msg === "string") shell.openExternal(msg);
  });

  ipcMain.on("discordRPCInit", (event, msg) => {
    discordRPC.init(msg);
  });

  ipcMain.on("mcLogInitTailing", (event, msg) => {
    mcLog.initTailing({ win, client: msg.client, customLogPath: msg.customLogPath });
  });

  ipcMain.on("mcLogStopTailing", (event, msg) => {
    mcLog.stopTailing();
  });

  ipcMain.on("mcLogCheckPath", (event, msg) => {
    win.webContents.send("mcLogCheckPathCallback", fs.existsSync(msg));
  });

  win.on("close", () => {
    win.webContents.send("window", win.getBounds());
  });
});

if (process.platform === "win32") {
  app.setAppUserModelId("Pixelic Overlay");
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
