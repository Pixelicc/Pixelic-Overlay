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
  const timer = Date.now();
  const { data } = await useFetch(`${process.env.VITE_DEV_SERVER_URL ? "http://localhost:3000" : "https://api.pixelic.de"}/v2/pixelic-overlay/tags`);
  console.log(`%c[TagSystem] Updated Tags in ${Date.now() - timer}ms`, "color: #a2d0c0");
  if (data.value) {
    tags = (data.value as any)?.tags || {};
  }
};

updateTags();
setInterval(() => updateTags(), 300 * 1000);

const getTags = (UUID: string) => {
  return tags?.[formatUUID(UUID)] || [];
};

export default {
  updateTags,
  getTags,
};
