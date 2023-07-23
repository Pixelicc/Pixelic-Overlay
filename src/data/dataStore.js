const Store = require("electron-store");
const store = new Store({
  name: "Pixelic-Overlay-Config",
  schema: {
    player: {
      type: "string",
      default: "",
    },
    pixelicKey: {
      type: "string",
      default: "",
    },
    client: {
      type: "string",
      default: "Default",
    },
    customLogFilePath: {
      type: "string",
      default: "",
    },
    mode: {
      type: "string",
      default: "overall",
    },
    selectedTheme: {
      type: "string",
      default: "dark",
    },
    customTheme: {
      type: "object",
      default: {
        dark: true,
        colors: {
          background: "#181a1c",
          primary: "#5C6BC0",
          secondary: "#B388FF",
          error: "#C62828",
          info: "#3F51B5",
          success: "#00e676",
          warning: "#EF6C00",
        },
      },
    },
    opacity: {
      type: "number",
      default: 0.75,
    },
    developerMode: {
      type: "boolean",
      default: false,
    },
    discordRPC: {
      type: "boolean",
      default: true,
    },
    hideIngame: {
      type: "boolean",
      default: false,
    },
    gameStartNotification: {
      type: "boolean",
      default: false,
    },
    queueNotification: {
      type: "boolean",
      default: false,
    },
    blacklistNotification: {
      type: "boolean",
      default: false,
    },
    blacklistExpiry: {
      type: "string",
      default: "1y",
    },
    colums: {
      type: "array",
      default: ["WS", "Wins", "WLR", "Finals", "FKDR", "BBLR"],
    },
    windowLocation: {
      type: "object",
      default: {},
    },
  },
});

export default store;
