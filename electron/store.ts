import Store from "electron-store";
import type { ThemeDefinition } from "vuetify/lib/framework.mjs";

const store = new Store<{
  APISettings: {
    key: string;
    customInstanceSettings: {
      baseURL: string;
    };
    translationServers: string[];
    customTranslationServerSettings: { URLs: { UUID: string; username: string }; paths: { UUID: string; username: string } };
  };
  overlaySettings: {
    username: string;
    client: "LUNAR" | "BADLION" | "DEFAULT" | "CUSTOM";
    customLogPath: string;
    advancedMode: boolean;
    discordRPC: boolean;
  };
  hypixelSettings: {
    mode: "BEDWARS" | "SKYWARS" | "DUELS" | "MURDER_MYSTERY";
    bedwarsSettings: {
      mode: "OVERALL" | "CORES" | "SOLO" | "DOUBLES" | "THREES" | "FOURS" | "4V4";
    };
    skywarsSettings: {
      mode: "OVERALL" | "SOLO" | "DOUBLES";
    };
    duelsSettings: {
      mode: "OVERALL";
    };
    murderMysterySettings: {
      mode: "OVERALL" | "CLASSIC" | "DOUBLE_UP" | "INFECTION" | "ASSASSINS";
    };
  };
  appearanceSettings: {
    opacity: string;
    theme: "DARK" | "LIGHT" | "CUSTOM";
    customThemeSettings: ThemeDefinition;
  };
  columnSettings: {
    columns: ("LEVEL" | "KARMA" | "ACHIEVEMENT_POINTS")[];
    bedwarsSettings: {
      columns: ("LEVEL" | "WINSTREAK" | "WINS" | "LOSSES" | "WLR" | "FINAL_KILLS" | "FINAL_DEATHS" | "FKDR" | "KILLS" | "DEATHS" | "KDR" | "BEDS_BROKEN" | "BEDS_LOST" | "BBLR")[];
    };
    skywarsSettings: {
      columns: ("LEVEL" | "WINS" | "LOSSES" | "WLR" | "KILLS" | "DEATHS" | "KDR")[];
    };
    duelsSettings: {
      columns: ("WINSTREAK" | "WINS" | "LOSSES" | "WLR" | "KILLS" | "DEATHS" | "KDR")[];
    };
    murderMysterySettings: {
      columns: ("WINS" | "LOSSES" | "WLR" | "KILLS" | "DEATHS" | "KDR" | "TIMES_HERO" | "MURDERER_CHANCE" | "DETECTIVE_CHANCE")[];
    };
  };
  notificationSettings: {
    gameStarted: boolean;
    queued: boolean;
    queuedBlacklisted: boolean;
  };
  blacklistSettings: {
    blacklists: { enabled: boolean; type?: string; ID: string }[];
  };
  windowSettings: {
    hideIngame: boolean;
    location: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  };
}>({
  name: "Pixelic-Overlay",
  schema: {
    APISettings: {
      type: "object",
      default: {
        key: "",
        customInstanceSettings: {
          baseURL: "",
        },
        translationServers: ["MOJANG"],
        customTranslationServerSettings: {
          URLs: {
            UUID: "",
            username: "",
          },
          paths: {
            UUID: "",
            username: "",
          },
        },
      },
    },
    overlaySettings: {
      type: "object",
      default: {
        username: "",
        client: "DEFAULT",
        customLogPath: "",
        advancedMode: false,
        discordRPC: true,
      },
    },
    hypixelSettings: {
      type: "object",
      default: {
        mode: "BEDWARS",
        bedwarsSettings: {
          mode: "OVERALL",
        },
        skywarsSettings: {
          mode: "OVERALL",
        },
        duelsSettings: {
          mode: "OVERALL",
        },
        murderMysterySettings: {
          mode: "OVERALL",
        },
      },
    },
    appearanceSettings: {
      type: "object",
      default: {
        opacity: "0.75",
        theme: "DARK",
        customThemeSettings: {
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
    },
    columnSettings: {
      type: "object",
      default: {
        columns: [],
        bedwarsSettings: {
          columns: ["LEVEL", "WINSTREAK", "WINS", "WLR", "FINAL_KILLS", "FKDR", "BBLR"],
        },
        skywarsSettings: {
          columns: ["LEVEL", "WINS", "LOSSES", "WLR", "KILLS", "DEATHS", "KDR"],
        },
        duelsSettings: {
          columns: ["WINSTREAK", "WINS", "LOSSES", "WLR", "KILLS", "DEATHS", "KDR"],
        },
        murderMysterySettings: {
          columns: ["WINS", "WLR", "KILLS", "KDR", "MURDERER_CHANCE", "DETECTIVE_CHANCE"],
        },
      },
    },
    notificationSettings: {
      type: "object",
      default: {
        gameStarted: false,
        queued: false,
        queuedBlacklisted: false,
      },
    },
    blacklistSettings: {
      type: "object",
      default: {
        blacklists: [
          {
            type: "PERSONAL",
            ID: "",
            enabled: true,
          },
        ],
      },
    },
    windowSettings: {
      type: "object",
      default: {
        hideIngame: false,
        location: {},
      },
    },
  },
});

export default store;
