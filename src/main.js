import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import { VDataTable } from "vuetify/labs/VDataTable";

import dataStore from "./data/dataStore";

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

const sakura = {
  dark: false,
  colors: {
    background: "#F5F5F5",
    primary: "#FF80AB",
    secondary: "#CE93D8",
    error: "#C62828",
    info: "#9575CD",
    success: "#00e676",
    warning: "#EF6C00",
  },
};

const vuetify = createVuetify({
  components: {
    ...components,
    VDataTable,
  },
  theme: {
    options: {
      customProperties: true,
    },
    defaultTheme: dataStore.get("selectedTheme"),
    themes: {
      light,
      dark,
      sakura,
      custom: dataStore.get("customTheme"),
    },
  },
});

createApp(App).use(vuetify).use(router).mount("#app");
