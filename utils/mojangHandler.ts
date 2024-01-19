import dataStore from "../electron/store";
import translationServers from "../constants/translationServers";

const chooseTranslationServer = () => {
  const servers = [];
  for (const ID of dataStore.get("translationServers")) {
    if (ID === "CUSTOM") {
      servers.push({ ...translationServers[ID], ...dataStore.get("customTranslationServer") });
    } else {
      // @ts-ignore
      servers.push(translationServers[ID]);
    }
  }
  return servers[Math.floor(Math.random() * servers.length)];
};

export const requestUUID = async (username: string): Promise<string | null> => {
  username = username.toLowerCase();

  const cache = useNuxtData(`Mojang:Cache:UUIDs:${username}`).data.value;
  if (typeof cache === "string") {
    return cache;
  }

  const translationServer = chooseTranslationServer();

  const { data } = await useFetch(translationServer.URLs.UUID.replace("{USERNAME}", username), {
    key: `Mojang:Cache:UUIDs:${username}`,
    timeout: 5000,
    transform: (data: any) => formatUUID(queryJSONPath(data, translationServer.paths.UUID)),
  });

  if (data.value) {
    return data.value as string;
  } else {
    return null;
  }
};

export const parseUUID = async (player: string) => {
  if (typeof player !== "string") return null;
  if (validateUUID(player)) return formatUUID(player);
  if (!validateUsername(player)) return null;
  return await requestUUID(player);
};
