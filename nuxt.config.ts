import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  router: {
    options: {
      hashMode: true,
    },
  },
  app: {
    baseURL: "./",
  },
  css: ["../main.css"],
  devtools: {
    enabled: false,
  },
  modules: [
    "nuxt-electron",
    "@nuxtjs/google-fonts",
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
  ],
  build: {
    transpile: ["vuetify"],
  },
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  electron: {
    build: [
      {
        entry: "electron/main.ts",
      },
    ],
    renderer: {},
  },
  googleFonts: {
    families: {
      Roboto: true,
    },
  },
});
