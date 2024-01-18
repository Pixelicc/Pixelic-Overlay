var tags: {
  [key: string]: {
    text?: string;
    tooltip?: string;
    color?: string;
    appendIcon?: string;
    prependIcon?: string;
  }[];
} = {};

const updateTags = async () => {
  const { data } = await useFetch("https://api.pixelic.de/v2/pixelic-overlay/tags");
  if (data.value) {
    tags = (data.value as any)?.tags || {};
  }
};

updateTags();
setInterval(() => updateTags(), 300 * 60 * 1000);

const getTags = (UUID: string) => {
  return tags?.[formatUUID(UUID)] || [];
};

export default {
  updateTags,
  getTags,
};