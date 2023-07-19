const { app, BrowserWindow, ipcMain, shell, Notification } = require("electron");
const fs = require("fs");
const path = require("path");
const Store = require("electron-store");
const Tail = require("tail").Tail;
const url = require("url");
const discordRPC = require("./src/misc/discordRPC");
const { isLatest } = require("./gitUpdate");

Store.initRenderer();

app.on("ready", () => {
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
      win.webContents.setZoomFactor(1);
    }
  });

  isLatest().then((latest) => {
    if (!latest) {
      const updateNotify = new Notification({
        title: "Update Available!",
        body: "An Update is available, to download the lastest version click here!",
        icon: path.join(__dirname, "./src/assets/logo.png"),
      });
      updateNotify.on("click", () => {
        shell.openExternal("https://github.com/Pixelicc/Pixelic-Overlay/releases/latest");
      });
      updateNotify.show();
    }
  });

  win.setAlwaysOnTop(true, "screen");
  win.removeMenu();

  ipcMain.on("devTools", (event, msg) => {
    if (msg === true) {
      win.webContents.openDevTools();
    } else {
      win.webContents.closeDevTools();
    }
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
    } else if (client === "Vanilla") {
      if (process.platform === "win32") {
        path = `${app.getPath("appData").replace(/\\/g, "/")}/.minecraft/logs/latest.log`;
      } else if (process.platform === "darwin") {
        path = `${app.getPath("home").replace(/\\/g, "/")}/Library/Application Support/minecraft/logs/latest.log`;
      } else if (process.platform === "linux") {
        path = `${app.getPath("home").replace(/\\/g, "/")}/.minecraft/logs/latest.log`;
      }
    }

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

  ipcMain.on("socials", (event, msg) => {
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
