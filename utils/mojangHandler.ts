export const requestUUID = async (username: string): Promise<string | null> => {
  username = username.toLowerCase();

  const cache = useNuxtData(`Mojang:Cache:UUIDs:${username}`).data.value;
  if (typeof cache === "string") {
    return cache;
  }

  const { data } = await useFetch(`https://api.mojang.com/users/profiles/minecraft/${username}`, {
    key: `Mojang:Cache:UUIDs:${username}`,
    timeout: 5000,
    transform: (data: { id: string; name: string }) => formatUUID(data.id),
  });

  if (data) {
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