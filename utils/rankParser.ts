const ranks: { [key: string]: string } = {
  OWNER: "§c[OWNER]",
  ADMIN: "§c[ADMIN]",
  GAME_MASTER: "§2[GM]",
  YOUTUBER: "§c[§fYOUTUBE§c]",
  PIG_PLUS_PLUS_PLUS: "§d[PIG§b+++§d]",
  MVP: "§b[MVP]",
  VIP_PLUS: "§a[VIP§6+§a]",
  VIP: "§a[VIP]",
};

const ranksShortened: { [key: string]: string } = {
  OWNER: "§c",
  ADMIN: "§c",
  GAME_MASTER: "§2",
  YOUTUBER: "§c",
  PIG_PLUS_PLUS_PLUS: "§d",
  MVP: "§b",
  VIP_PLUS: "§a",
  VIP: "§a",
};

const plusColors: { [key: string]: string } = {
  GREEN: "§a",
  AQUA: "§b",
  RED: "§c",
  LIGHT_PURPLE: "§d",
  YELLOW: "§e",
  WHITE: "§f",
  BLACK: "§0",
  DARK_BLUE: "§1",
  DARK_GREEN: "§2",
  DARK_AQUA: "§3",
  DARK_RED: "§4",
  DARK_PURPLE: "§5",
  GOLD: "§6",
  GRAY: "§7",
  DARK_GRAY: "§8",
  BLUE: "§9",
};

export const parseRank = (rank: string | null, plusColor: string | null, plusPlusColor: string | null) => {
  if (rank === null) {
    return { full: "§7", shortened: "§7" };
  }
  if (rank === "MVP_PLUS_PLUS" && plusColor && plusPlusColor) {
    return { full: `${plusColors[plusPlusColor]}[MVP${plusColors[plusColor]}++${plusColors[plusPlusColor]}]`, shortened: "§6" };
  }
  if (rank === "MVP_PLUS" && plusColor) {
    return { full: `§b[MVP${plusColors[plusColor]}+§b]`, shortened: "§b" };
  }
  if (Object.hasOwn(ranks, rank)) {
    return { full: ranks[rank], shortened: ranksShortened[rank] };
  }
  return { full: "", shortened: "" };
};
