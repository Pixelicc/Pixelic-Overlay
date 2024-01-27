import { app, BrowserWindow, ipcMain, shell, Notification } from "electron";
import log from "electron-log";
import { autoUpdater } from "electron-updater";
import Store from "electron-store";
import fs from "fs";
import path from "path";
import dataStore from "./store";
import mcLog from "./scripts/mcLog";
import discordRPC from "./scripts/discordRPC";
import PackageJSON from "../package.json";

process.env.ROOT = path.join(__dirname, "..");
process.env.DIST = path.join(process.env.ROOT, "dist-electron");
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL ? path.join(process.env.ROOT, "public") : path.join(process.env.ROOT, ".output/public");
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

autoUpdater.logger = log;

Store.initRenderer();

app.whenReady().then(async () => {
  if (process.platform !== "darwin") {
    autoUpdater.disableWebInstaller = true;
    autoUpdater.checkForUpdatesAndNotify();
  } else {
    autoUpdater.autoDownload = false;
    autoUpdater.checkForUpdates().then((status) => {
      if (status && PackageJSON.version !== status.updateInfo.version) {
        const notification = new Notification({
          title: "Update Available!",
          body: `An Update is available, to download the lastest version click here! Your installed Version: ${PackageJSON.version} | Latest Version: ${status.updateInfo.version}`,
          icon: path.join(__dirname, "assets/logo.png"),
        });
        notification.on("click", () => {
          shell.openExternal("https://github.com/pixelicc/pixelic-overlay/releases/latest");
        });
        notification.show();
      }
    });
  }

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 600,
    minHeight: 400,
    autoHideMenuBar: true,
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

  win.setBounds(dataStore.get("windowSettings").location);
  win.setAlwaysOnTop(true, "floating");

  var isFirstLoad = true;

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
    log.info("Loading Nuxt-App in Dev-Mode...");
  } else {
    win.loadFile(path.join(process.env.VITE_PUBLIC!, "index.html"));
    log.info("Loading bundled Nuxt-App...");
  }

  win.webContents.on("dom-ready", () => {
    win.webContents.insertCSS(`
      ::-webkit-scrollbar {
        display: none;
      }
    `);
    if (isFirstLoad) {
      isFirstLoad = false;
      return;
    }
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
  win.on("close", () => {
    dataStore.set("windowSettings.location", win.getBounds());
  });

  ipcMain.on("window", (event, msg) => {
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
  });

  mcLog.initTailing({ win, client: dataStore.get("overlaySettings").client, customLogPath: dataStore.get("overlaySettings").customLogPath });
  ipcMain.on("mcLogInitTailing", (event, msg) => {
    mcLog.initTailing({ win, client: msg.client, customLogPath: msg.customLogPath });
  });
  ipcMain.on("mcLogStopTailing", (event, msg) => {
    mcLog.stopTailing();
  });
  ipcMain.on("mcLogCheckPath", (event, msg) => {
    win.webContents.send("mcLogCheckPathCallback", fs.existsSync(msg));
  });

  ipcMain.on("link", (event, msg) => {
    if (typeof msg === "string") shell.openExternal(msg);
  });

  ipcMain.on("discordRPC", (event, msg) => {
    discordRPC(msg);
  });

  ipcMain.on("openStatistics", (event, msg) => {
    win.webContents.send("openStatistics", msg);
  });
});

if (process.platform === "win32") {
  app.setAppUserModelId("Pixelic Overlay");
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
