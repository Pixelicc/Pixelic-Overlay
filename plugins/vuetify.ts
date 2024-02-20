import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import dataStore from "../electron/store.js";

const light = {
  dark: false,
  colors: {
    background: "#F5F5F5",
    primary: "#00ACC1",
    secondary: "#00ACC1",
    error: "#C62828",
    info: "#26C6DA",
    success: "#00e676",
    warning: "#EF6C00",
  },
};

const dark = {
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
};

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    defaults: {
      VApp: {
        style: "background-color: rgba(var(--v-theme-background), var(--opacity)) !important",
      },
      VCard: {
        rounded: "lg",
      },
    },
    components: {
      ...components,
    },
    theme: {
      // @ts-ignore
      options: {
        customProperties: true,
      },
      defaultTheme: dataStore.get("appearanceSettings").theme.toLowerCase(),
      themes: {
        light,
        dark,
        custom: dataStore.get("appearanceSettings").customThemeSettings,
      },
    },
  });
  app.vueApp.use(vuetify);
});
