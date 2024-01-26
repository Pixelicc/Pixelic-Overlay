import dataStore from "../electron/store";

const chooseTranslationServer = () => {
  const servers = [];
  for (const ID of dataStore.get("APISettings").translationServers) {
    if (ID === "CUSTOM") {
      servers.push({ ...Constants.overlay.translationServers[ID], ...dataStore.get("APISettings").customTranslationServerSettings });
    } else {
      // @ts-ignore
      servers.push(Constants.overlay.translationServers[ID]);
    }
  }
  return servers[Math.floor(Math.random() * servers.length)];
};

const requestUUID = async (username: string): Promise<string | null> => {
  username = username.toLowerCase();

  const cache = useNuxtData(`Mojang:Cache:UUIDs:${username}`).data.value;
  if (typeof cache === "string") {
    return cache;
  }

  const translationServer = chooseTranslationServer();

  const { data } = await useFetch(translationServer.URLs.UUID.replace("{USERNAME}", username), {
    key: `Mojang:Cache:UUIDs:${username}`,
    retry: 3,
    retryDelay: 5000,
    timeout: 5000,
    transform: (data: any) => formatUUID(queryJSONPath(data, translationServer.paths.UUID)),
  });

  if (data?.value) {
    return data.value as string;
  } else {
    return null;
  }
};

export const parseUUID = async (player: string) => {
  if (validateUUID(player)) return formatUUID(player);
  if (!validateUsername(player)) return null;
  return await requestUUID(player);
};
