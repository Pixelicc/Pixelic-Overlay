<template>
  <v-app>
    <Navigation />
    <NuxtPage />
    <v-container>
      <v-row>
        <v-col>
          <h2>Appearance Settings</h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card titel="Basic">
            <div class="ml-4 mr-4 mt-4">
              <v-slider class="mt-6" thumb-label :min="0" :max="100" :step="1" color="secondary" label="Opacity" prepend-icon="mdi-opacity" v-model="opacity" @update:model-value="setOpacity"></v-slider>
              <v-list density="compact">
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon>mdi-eye-off</v-icon>
                  </template>
                  <template v-slot:append>
                    <v-switch color="secondary" v-model="hideIngame" @update:model-value="toggleHideIngame" style="display: flex"></v-switch>
                  </template>
                  <v-list-item-title>Hide Ingame</v-list-item-title>
                </v-list-item>
              </v-list>
            </div>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card title="Theme">
            <div class="ml-4 mr-4 mt-4">
              <v-select label="Theme" variant="outlined" :items="themes" prepend-inner-icon="mdi-palette-outline" v-model="currentTheme" return-object @update:modelValue="setTheme"></v-select>
              <v-divider v-if="theme.global.name.value === 'custom'" thickness="8" class="border-opacity-0"></v-divider>
              <div v-if="theme.global.name.value === 'custom'">
                <v-select label="Component" variant="outlined" :items="themeComponents" prepend-inner-icon="mdi-palette-outline" v-model="previewedComponent" return-object @update:modelValue="setThemeComponent"></v-select>
              </div>
              <div class="d-flex justify-center mb-4">
                <v-color-picker v-if="theme.global.name.value === 'custom'" return-object @update:modelValue="setThemeComponentColor" hide-inputs mode="hex"></v-color-picker>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script setup lang="ts">
import dataStore from "../../electron/store";
import { useTheme } from "vuetify";

const opacity = ref(0);
opacity.value = Math.round(Number(dataStore.get("opacity")) * 100);

const setOpacity = (value: number) => {
  dataStore.set("opacity", (value / 100).toFixed(2));
  opacity.value = Math.round(Number(dataStore.get("opacity")) * 100);
  (document.querySelector(":root") as HTMLElement).style.setProperty("--opacity", dataStore.get("opacity"));
};

const hideIngame = ref(false);
hideIngame.value = dataStore.get("hideIngame");

const toggleHideIngame = (HideIngame: boolean | null) => {
  if (HideIngame === true || HideIngame === false) {
    dataStore.set("hideIngame", HideIngame);
    hideIngame.value = dataStore.get("hideIngame");
  }
};

const themes = ["Dark 🌙", "Light 💡", "Sakura 🌸", "Custom 🎨"];

const theme = useTheme();
const currentTheme = ref("");
currentTheme.value = theme.global.name.value.charAt(0).toUpperCase() + theme.global.name.value.slice(1);

const setTheme = (selectedTheme: string) => {
  dataStore.set("selectedTheme", selectedTheme.split(" ")[0].toLowerCase());
  theme.global.name.value = dataStore.get("selectedTheme");
};

var reloadingTheme = false;

const reloadTheme = () => {
  theme.global.name.value = "dark";
  theme.global.name.value = "custom";

  new Promise((r) => setTimeout(r, 100)).then(() => {
    reloadingTheme = false;
  });
};

const themeComponents = ["Background", "Primary", "Secondary", "Error", "Info", "Success", "Warning"];
const selectedComponent = ref("");
const previewedComponent = ref("");

previewedComponent.value = "Background";

const setThemeComponent = (component: string) => {
  selectedComponent.value = component.toLowerCase();
};

setThemeComponent("Background");

const setThemeComponentColor = (selectedColor: string) => {
  if (selectedColor === undefined) return;

  // @ts-ignore
  theme.global.current["_value"].colors[selectedComponent.value] = selectedColor;

  dataStore.set("customTheme", { ...dataStore.get("customTheme"), colors: { ...dataStore.get("customTheme").colors, [selectedComponent.value]: selectedColor } });

  if (!reloadingTheme) {
    reloadingTheme = true;
    reloadTheme();
  }
};
</script>
