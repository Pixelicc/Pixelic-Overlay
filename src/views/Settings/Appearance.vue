<template>
  <v-app>
    <v-container>
      <v-row>
        <v-col>
          <h2>Appearance Settings</h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card title="General">
            <div class="ml-4 mr-4 mt-4">
              <v-slider thumb-label :min="0" :max="100" :step="1" color="secondary" label="Opacity" prepend-icon="mdi-opacity" v-model="opacity" @update:model-value="setOpacity"></v-slider>
              <v-list density="compact">
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon>mdi-eye-off</v-icon>
                  </template>
                  <template v-slot:append>
                    <v-switch color="secondary" v-model="hideIngame" @change="toggleHideIngame" style="display: flex"></v-switch>
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
              <v-divider v-if="theme.global.name.value === 'custom'" :thickness="8" class="border-opacity-0"></v-divider>
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

<script setup>
import dataStore from "../../data/dataStore";
import { ref } from "vue";
import { useTheme } from "vuetify";

const opacity = ref(0);
opacity.value = Math.round(dataStore.get("opacity") * 100);

const setOpacity = (value) => {
  document.querySelector(":root").style.setProperty("--opacity", value / 100);
  dataStore.set("opacity", value / 100);
};

const hideIngame = ref(0);
hideIngame.value = dataStore.get("hideIngame");

const toggleHideIngame = () => {
  dataStore.set("hideIngame", hideIngame.value);
};

const theme = useTheme();
const currentTheme = ref(0);
currentTheme.value = theme.global.name.value.charAt(0).toUpperCase() + theme.global.name.value.slice(1);
const themes = ["Dark 🌙", "Light 💡", "Sakura 🌸", "Custom 🎨"];

const setTheme = (selectedTheme) => {
  theme.global.name.value = selectedTheme.split(" ")[0].toLowerCase();
  dataStore.set("selectedTheme", selectedTheme.split(" ")[0].toLowerCase());
};

const themeComponents = ["Background", "Primary", "Secondary", "Error", "Info", "Success", "Warning"];
const selectedComponent = ref(0);
const previewedComponent = ref(0);

previewedComponent.value = "Background";

const setThemeComponent = (component) => {
  selectedComponent.value = component.toLowerCase();
};

setThemeComponent("Background");

var reloadingTheme = false;

const reloadTheme = () => {
  theme.global.name.value = "dark";
  theme.global.name.value = "custom";

  new Promise((r) => setTimeout(r, 100)).then(() => {
    reloadingTheme = false;
  });
};

const setThemeComponentColor = (selectedColor) => {
  if (selectedColor === undefined) return;

  theme.global.current["_value"].colors[selectedComponent.value] = selectedColor;

  dataStore.set("customTheme", { ...dataStore.get("customTheme"), colors: { ...dataStore.get("customTheme").colors, [selectedComponent.value]: selectedColor } });

  if (!reloadingTheme) {
    reloadingTheme = true;
    reloadTheme();
  }
};
</script>
