import dataStore from "../electron/store";

const hypixelMode = ref(dataStore.get("hypixelSettings").mode);
const bedwarsMode = ref(dataStore.get("hypixelSettings").bedwarsSettings.mode);
const skywarsMode = ref(dataStore.get("hypixelSettings").skywarsSettings.mode);
const duelsMode = ref(dataStore.get("hypixelSettings").duelsSettings.mode);
const murderMysteryMode = ref(dataStore.get("hypixelSettings").murderMysterySettings.mode);

const minigameMode: Ref<"OVERALL" | "CORES" | "SOLO" | "DOUBLES" | "THREES" | "FOURS" | "4V4" | "OVERALL" | "CLASSIC" | "DOUBLE_UP" | "INFECTION" | "ASSASSINS"> = ref("OVERALL");

var lastHypixelMode = hypixelMode.value;
watch([hypixelMode, bedwarsMode, skywarsMode, duelsMode, murderMysteryMode], () => {
  if (hypixelMode.value === "BEDWARS") {
    if (minigameMode.value !== bedwarsMode.value) {
      console.log(`%c[GamemodeManager] Switched Minigame Gamemode from ${minigameMode.value} to ${bedwarsMode.value}`, "color: #7ed9e6");
      minigameMode.value = bedwarsMode.value;
    }
  } else if (hypixelMode.value === "SKYWARS") {
    if (minigameMode.value !== skywarsMode.value) {
      console.log(`%c[GamemodeManager] Switched Minigame Gamemode from ${minigameMode.value} to ${skywarsMode.value}`, "color: #756AB6");
      minigameMode.value = skywarsMode.value;
    }
  } else if (hypixelMode.value === "DUELS") {
    if (minigameMode.value !== duelsMode.value) {
      console.log(`%c[GamemodeManager] Switched Minigame Gamemode from ${minigameMode.value} to ${duelsMode.value}`, "color: #756AB6");
      minigameMode.value = duelsMode.value;
    }
  } else {
    if (minigameMode.value !== murderMysteryMode.value) {
      console.log(`%c[GamemodeManager] Switched Minigame Gamemode from ${minigameMode.value} to ${murderMysteryMode.value}`, "color: #756AB6");
      minigameMode.value = murderMysteryMode.value;
    }
  }
  if (lastHypixelMode !== hypixelMode.value) {
    console.log(`%c[GamemodeManager] Switched Hypixel Gamemode from ${lastHypixelMode} to ${hypixelMode.value}`, "color: #756AB6");
    lastHypixelMode = hypixelMode.value;
  }
});

export default {
  hypixelMode,
  bedwarsMode,
  skywarsMode,
  duelsMode,
  murderMysteryMode,
  minigameMode,
};
