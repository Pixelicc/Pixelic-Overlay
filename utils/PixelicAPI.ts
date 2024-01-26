import type { UseFetchOptions } from "nuxt/dist/app/composables";
import type { KeysOf } from "nuxt/dist/app/composables/asyncData";

import dataStore from "../electron/store";
import PackageJSON from "../package.json";

const getAPI = () => {
  if (dataStore.get("overlaySettings").advancedMode && dataStore.get("APISettings").customInstanceSettings.baseURL.length !== 0) {
    return dataStore.get("APISettings").customInstanceSettings.baseURL;
  }
  return process.env.VITE_DEV_SERVER_URL ? "http://localhost:3000" : "https://api.pixelic.de";
};

export default async (request: string | globalThis.Ref<string> | (() => string), options?: UseFetchOptions<unknown, unknown, KeysOf<unknown>, null, string, "GET" | "POST" | "DELETE"> | undefined) => {
  return await useFetch(request, {
    ...options,
    baseURL: getAPI(),
    headers: {
      "X-API-Key": dataStore.get("APISettings").key,
      "X-Overlay-Version": PackageJSON.version,
      ...options?.headers,
    },
  });
};
