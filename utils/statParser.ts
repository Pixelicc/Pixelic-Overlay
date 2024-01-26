export const parseStat = (value: number, stat: string, hypixelMode: "BEDWARS" | "SKYWARS" | "DUELS" | "MURDER_MYSTERY", minigameMode: string) => {
  if (stat === "WINS") {
    if (value >= 25_000) return "§5" + value.toLocaleString("en-US");
    if (value >= 10_000) return "§d" + value.toLocaleString("en-US");
    if (value >= 7_500) return "§4" + value.toLocaleString("en-US");
    if (value >= 5_000) return "§c" + value.toLocaleString("en-US");
    if (value >= 2_500) return "§6" + value.toLocaleString("en-US");
    if (value >= 1_000) return "§e" + value.toLocaleString("en-US");
    if (value >= 500) return "§2" + value;
    if (value >= 250) return "§a" + value;
    if (value >= 125) return "§f" + value;
  }
  if (stat === "LOSSES") {
    if (value >= 25_000) return "§5" + value.toLocaleString("en-US");
    if (value >= 10_000) return "§d" + value.toLocaleString("en-US");
    if (value >= 7_500) return "§4" + value.toLocaleString("en-US");
    if (value >= 5_000) return "§c" + value.toLocaleString("en-US");
    if (value >= 2_500) return "§6" + value.toLocaleString("en-US");
    if (value >= 1_000) return "§e" + value.toLocaleString("en-US");
    if (value >= 500) return "§2" + value;
    if (value >= 250) return "§a" + value;
    if (value >= 125) return "§f" + value;
  }
  if (stat === "WINSTREAK") {
    if (hypixelMode === "BEDWARS" && minigameMode === "4V4") {
      if (value >= 1000) return "§5" + value.toLocaleString("en-US");
      if (value >= 750) return "§d" + value;
      if (value >= 500) return "§4" + value;
      if (value >= 400) return "§c" + value;
      if (value >= 300) return "§6" + value;
      if (value >= 200) return "§e" + value;
      if (value >= 100) return "§2" + value;
      if (value >= 50) return "§a" + value;
      if (value >= 25) return "§f" + value;
    } else {
      if (value >= 100) return "§5" + value.toLocaleString("en-US");
      if (value >= 75) return "§d" + value;
      if (value >= 50) return "§4" + value;
      if (value >= 40) return "§c" + value;
      if (value >= 30) return "§6" + value;
      if (value >= 20) return "§e" + value;
      if (value >= 15) return "§2" + value;
      if (value >= 10) return "§a" + value;
      if (value >= 5) return "§f" + value;
    }
  }
  if (stat === "WLR") {
    value = Number(value.toFixed(2));
    if (value >= 25) return "§5" + value.toLocaleString("en-US");
    if (value >= 15) return "§d" + value;
    if (value >= 10) return "§4" + value;
    if (value >= 5) return "§c" + value;
    if (value >= 3) return "§6" + value;
    if (value >= 2) return "§e" + value;
    if (value >= 1.5) return "§2" + value;
    if (value >= 1) return "§a" + value;
    if (value >= 0.5) return "§f" + value;
  }
  if (stat === "FINAL_KILLS") {
    if (value >= 100_000) return "§5" + value.toLocaleString("en-US");
    if (value >= 50_000) return "§d" + value.toLocaleString("en-US");
    if (value >= 25_000) return "§4" + value.toLocaleString("en-US");
    if (value >= 15_000) return "§c" + value.toLocaleString("en-US");
    if (value >= 10_000) return "§6" + value.toLocaleString("en-US");
    if (value >= 7_500) return "§e" + value.toLocaleString("en-US");
    if (value >= 5_000) return "§2" + value.toLocaleString("en-US");
    if (value >= 2_500) return "§a" + value.toLocaleString("en-US");
    if (value >= 1_250) return "§f" + value.toLocaleString("en-US");
  }
  if (stat === "FKDR") {
    value = Number(value.toFixed(2));
    if (value >= 100) return "§5" + value.toLocaleString("en-US");
    if (value >= 50) return "§d" + value;
    if (value >= 25) return "§4" + value;
    if (value >= 10) return "§c" + value;
    if (value >= 7) return "§6" + value;
    if (value >= 5) return "§e" + value;
    if (value >= 3) return "§2" + value;
    if (value >= 2) return "§a" + value;
    if (value >= 1) return "§f" + value;
  }
  if (stat === "KILLS") {
    if (value >= 200_000) return "§5" + value.toLocaleString("en-US");
    if (value >= 100_000) return "§d" + value.toLocaleString("en-US");
    if (value >= 50_000) return "§4" + value.toLocaleString("en-US");
    if (value >= 30_000) return "§c" + value.toLocaleString("en-US");
    if (value >= 20_000) return "§6" + value.toLocaleString("en-US");
    if (value >= 15_000) return "§e" + value.toLocaleString("en-US");
    if (value >= 10_000) return "§2" + value.toLocaleString("en-US");
    if (value >= 5_000) return "§a" + value.toLocaleString("en-US");
    if (value >= 2_500) return "§f" + value.toLocaleString("en-US");
  }
  if (stat === "DEATHS") {
    if (value >= 200_000) return "§5" + value.toLocaleString("en-US");
    if (value >= 100_000) return "§d" + value.toLocaleString("en-US");
    if (value >= 50_000) return "§4" + value.toLocaleString("en-US");
    if (value >= 30_000) return "§c" + value.toLocaleString("en-US");
    if (value >= 20_000) return "§6" + value.toLocaleString("en-US");
    if (value >= 15_000) return "§e" + value.toLocaleString("en-US");
    if (value >= 10_000) return "§2" + value.toLocaleString("en-US");
    if (value >= 5_000) return "§a" + value.toLocaleString("en-US");
    if (value >= 2_500) return "§f" + value.toLocaleString("en-US");
  }
  if (stat === "KDR") {
    value = Number(value.toFixed(2));
    if (value >= 50) return "§5" + value.toLocaleString("en-US");
    if (value >= 25) return "§d" + value;
    if (value >= 15) return "§4" + value;
    if (value >= 10) return "§c" + value;
    if (value >= 7) return "§6" + value;
    if (value >= 5) return "§e" + value;
    if (value >= 3) return "§2" + value;
    if (value >= 2) return "§a" + value;
    if (value >= 1) return "§f" + value;
  }
  if (stat === "BEDS_BROKEN") {
    if (value >= 50_000) return "§5" + value.toLocaleString("en-US");
    if (value >= 25_000) return "§d" + value.toLocaleString("en-US");
    if (value >= 20_000) return "§4" + value.toLocaleString("en-US");
    if (value >= 15_000) return "§c" + value.toLocaleString("en-US");
    if (value >= 10_000) return "§6" + value.toLocaleString("en-US");
    if (value >= 5_000) return "§e" + value.toLocaleString("en-US");
    if (value >= 2_500) return "§2" + value.toLocaleString("en-US");
    if (value >= 1_250) return "§a" + value.toLocaleString("en-US");
    if (value >= 750) return "§f" + value.toLocaleString("en-US");
  }
  if (stat === "BEDS_LOST") {
    if (value >= 50_000) return "§5" + value.toLocaleString("en-US");
    if (value >= 25_000) return "§d" + value.toLocaleString("en-US");
    if (value >= 20_000) return "§4" + value.toLocaleString("en-US");
    if (value >= 15_000) return "§c" + value.toLocaleString("en-US");
    if (value >= 10_000) return "§6" + value.toLocaleString("en-US");
    if (value >= 5_000) return "§e" + value.toLocaleString("en-US");
    if (value >= 2_500) return "§2" + value.toLocaleString("en-US");
    if (value >= 1_250) return "§a" + value.toLocaleString("en-US");
    if (value >= 750) return "§f" + value.toLocaleString("en-US");
  }
  if (stat === "BBLR") {
    value = Number(value.toFixed(2));
    if (value >= 100) return "§5" + value.toLocaleString("en-US");
    if (value >= 50) return "§d" + value;
    if (value >= 25) return "§4" + value;
    if (value >= 10) return "§c" + value;
    if (value >= 7) return "§6" + value;
    if (value >= 5) return "§e" + value;
    if (value >= 3) return "§2" + value;
    if (value >= 2) return "§a" + value;
    if (value >= 1) return "§f" + value;
  }
  if (stat === "MURDERER_CHANCE") return "§c" + value + "%";
  if (stat === "DETECTIVE_CHANCE") return "§b" + value + "%";
  if (stat === "TIMES_HERO") return "§3" + value.toLocaleString("en-US");
  if (stat === "LEVEL") return "§3" + Number(value.toFixed(2)).toLocaleString("en-US");
  if (stat === "KARMA") return "§d" + formatNumber(value, 2);
  if (stat === "ACHIEVEMENT_POINTS") return "§e" + value.toLocaleString("en-US");
  return "§7" + value;
};
