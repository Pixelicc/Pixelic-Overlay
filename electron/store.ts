import Store from "electron-store";
import type { ThemeDefinition } from "vuetify/lib/framework.mjs";

const store = new Store<{
  player: string;
  pixelicKey: string;
  client: "LUNAR" | "BADLION" | "DEFAULT" | "CUSTOM";
  customLogPath: string;
  mode: string;
  selectedTheme: string;
  customTheme: ThemeDefinition;
  opacity: string;
  developerMode: boolean;
  discordRPC: boolean;
  hideIngame: boolean;
  gameStartNotification: boolean;
  queueNotification: boolean;
  blacklistNotification: boolean;
  blacklists: { enabled: boolean; type?: string; ID: string }[];
  colums: string[];
  windowLocation: any;
}>({
  name: "Pixelic-Overlay",
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
      default: "DEFAULT",
    },
    customLogPath: {
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
      type: "string",
      default: "0.75",
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
    blacklists: {
      type: "array",
      default: [
        {
          type: "PERSONAL",
          ID: "",
          enabled: true,
        },
      ],
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
