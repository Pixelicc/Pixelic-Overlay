<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>Appearance Settings</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card title="Basic">
          <v-card-text class="mt-4">
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
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card title="Theme">
          <div class="ml-4 mr-4 mt-4">
            <v-select label="Theme" variant="outlined" color="secondary" :items="Object.values(Constants.overlay.themes)" prepend-inner-icon="mdi-palette-outline" v-model="currentTheme" return-object @update:modelValue="setTheme"></v-select>
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
</template>

<script setup lang="ts">
import dataStore from "../../electron/store";
import { useTheme } from "vuetify";

const opacity = ref(Math.round(Number(dataStore.get("appearanceSettings").opacity) * 100));
const setOpacity = (value: number) => {
  dataStore.set("appearanceSettings.opacity", (value / 100).toFixed(2));
  (document.querySelector(":root") as HTMLElement).style.setProperty("--opacity", dataStore.get("appearanceSettings").opacity);
};

const hideIngame = ref(dataStore.get("windowSettings").hideIngame);
const toggleHideIngame = () => {
  dataStore.set("windowSettings.hideIngame", hideIngame.value);
};

const theme = useTheme();
// @ts-ignore
const currentTheme = ref(Constants.overlay.themes[theme.global.name.value.toUpperCase()]);
const setTheme = (selectedTheme: string) => {
  dataStore.set("appearanceSettings.theme", reverseObject(Constants.overlay.themes)[selectedTheme]);
  theme.global.name.value = Constants.overlay.themes[dataStore.get("appearanceSettings").theme];
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

  theme.themes.value.custom.colors[selectedComponent.value] = selectedColor;
  dataStore.set("appearanceSettings.customThemeSettings", { ...dataStore.get("appearanceSettings").customThemeSettings, colors: { ...dataStore.get("appearanceSettings").customThemeSettings.colors, [selectedComponent.value]: selectedColor } });
};
</script>
