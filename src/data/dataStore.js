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
      default: "Vanilla",
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
