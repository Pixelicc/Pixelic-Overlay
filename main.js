const { app, BrowserWindow, ipcMain, shell, Notification } = require("electron");
const log = require("electron-log");
const { autoUpdater } = require("electron-updater");
const fs = require("fs");
const path = require("path");
const Store = require("electron-store");
const Tail = require("tail").Tail;
const url = require("url");
const discordRPC = require("./src/misc/discordRPC");

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "info";
log.info("Pixelic Overlay is starting...");

Store.initRenderer();

app.on("ready", () => {
  if (process.platform !== "darwin") {
    autoUpdater.disableWebInstaller = true;
    autoUpdater.checkForUpdatesAndNotify();
  } else {
    // As MacOS requires code signing for auto update mac users are only notified about and update and are required to install it themselves.
    const { isLatest } = require("./gitUpdate");
    isLatest().then((latest) => {
      if (!latest) {
        const updateNotification = new Notification({
          title: "Update Available!",
          body: "An Update is available, to download the lastest version click here!",
          icon: path.join(__dirname, "./src/assets/logo.png"),
        });
        updateNotification.on("click", () => {
          shell.openExternal("https://github.com/pixelicc/pixelic-overlay/releases/latest");
        });
        updateNotification.show();
      }
    });
  }

  const win = new BrowserWindow({
    autoHideMenuBar: true,
    width: 800,
    height: 600,
    minWidth: 600,
    minHeight: 400,
    transparent: true,
    frame: false,
    hasShadow: process.platform !== "darwin",
    icon: "./src/assets/logo.png",
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
    },
  });

  win.loadURL(
    url.format({
      pathname: path.join(`${__dirname}/dist`, "index.html"),
      protocol: "file:",
      slashes: true,
    })
  );

  win.on("resize", () => {
    const width = win.getContentSize()[0];
    if (width < 800) {
      win.webContents.setZoomFactor(0.8);
    } else {
      win.webContents.setZoomFactor(0.95);
    }
  });

  win.setAlwaysOnTop(true, "screen");
  win.removeMenu();

  // Open Discord OAuth2
  ipcMain.on("discordAuth", (event, msg) => {
    log.info("Requesting Discord OAuth2...");
    shell.openExternal("https://discord.com/api/oauth2/authorize?client_id=1109792550459539546&redirect_uri=https%3A%2F%2Fapi.pixelic.de%2Fhypixel%2Fv1%2Foverlay%2Fkey&response_type=code&scope=identify");
  });

  ipcMain.once("logPath", (event, msg) => {
    const client = msg[0];
    const customPath = msg[1];

    var path = customPath;

    if (client === "Lunar") {
      path = `${app.getPath("home").replace(/\\/g, "/")}/.lunarclient/offline/multiver/logs/latest.log`;
    } else if (client === "Badlion") {
      if (process.platform === "win32") {
        path = `${app.getPath("appData").replace(/\\/g, "/")}/.minecraft/logs/blclient/minecraft/latest.log`;
      } else if (process.platform === "darwin") {
        path = `${app.getPath("home").replace(/\\/g, "/")}/Library/Application Support/minecraft/logs/blclient/minecraft/latest.log`;
      } else if (process.platform === "linux") {
        path = `${app.getPath("home").replace(/\\/g, "/")}/.minecraft/logs/blclient/minecraft/latest.log`;
      }
    } else if (client === "Default") {
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
      const tail = new Tail(path, {
        useWatchFile: true,
        nLines: 1,
        fsWatchOptions: { interval: 100 },
      });

      tail.on("line", (data) => {
        const chat = data.indexOf("[CHAT]");
        if (chat !== -1) {
          const msg = data.substring(chat + 7).replace(/(§|�)([0-9]|a|b|e|d|f|k|l|m|n|o|r|c)/gm, "");
          win.webContents.send("mcLog", msg);
        }
      });
    }
  });

  ipcMain.on("notification", (event, msg) => {
    const notification = new Notification({
      title: "Pixelic-Overlay",
      body: msg,
      icon: path.join(__dirname, "./src/assets/logo.png"),
    });
    notification.show();
  });

  ipcMain.on("devTools", (event, msg) => {
    if (msg === true) {
      win.webContents.openDevTools();
    } else {
      win.webContents.closeDevTools();
    }
  });

  ipcMain.on("windowEvent", (event, msg) => {
    if (typeof msg === "object" && Object.keys(msg).length !== 0) {
      win.setBounds(msg);
    } else {
      if (msg === "minimizeWindow") {
        win.minimize();
      }
      if (msg === "closeWindow") {
        win.close();
      }
      if (msg === "hide") {
        win.hide();
      }
      if (msg === "show") {
        win.show();
      }
    }
  });

  ipcMain.on("logChange", (event, msg) => {
    app.relaunch();
    app.quit();
  });

  ipcMain.on("discordRPC-init", (event, msg) => {
    discordRPC.init(msg[0], msg[1]);
  });

  ipcMain.on("discordRPC-set", (event, msg) => {
    discordRPC.set(msg);
  });

  ipcMain.on("openURL", (event, msg) => {
    shell.openExternal(msg);
  });

  // Redirects Search player(s) input to statistics page
  ipcMain.on("viewStatistics", (event, msg) => {
    win.webContents.send("viewStatistics", msg);
  });

  win.on("close", () => {
    win.webContents.send("windowLocation", win.getBounds());
  });
});

if (process.platform === "win32") {
  app.setAppUserModelId("Pixelic Overlay");
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
