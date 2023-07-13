const ranks = {
  OWNER: "§c[OWNER]",
  ADMIN: "§c[ADMIN]",
  YOUTUBER: "§c[§fYOUTUBE§c]",
  PIG_PLUS_PLUS_PLUS: "§d[PIG§b+++§d]",
  MVP: "§b[MVP]",
  VIP_PLUS: "§a[VIP§6+§a]",
  VIP: "§a[VIP]",
};

const ranksSimple = {
  OWNER: "§c",
  ADMIN: "§c",
  YOUTUBER: "§c",
  PIG_PLUS_PLUS_PLUS: "§d",
  MVP: "§b",
  VIP_PLUS: "§a",
  VIP: "§a",
};

const plusColors = {
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

export default function (rank, plusColor, plusPlusColor) {
  if (rank === null) {
    return ["§7", "§7"];
  }
  if (rank === "MVP_PLUS_PLUS") {
    return [`${plusColors[plusPlusColor]}[MVP${plusColors[plusColor]}++${plusColors[plusPlusColor]}]`, "§6"];
  }
  if (rank === "MVP_PLUS") {
    return [`§b[MVP${plusColors[plusColor]}+§b]`, "§b"];
  }
  if (ranks[rank] !== undefined) {
    return [ranks[rank], ranksSimple[rank]];
  }
  return "";
}
