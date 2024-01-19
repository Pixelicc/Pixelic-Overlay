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
  const { data } = await useFetch(`${getAPIInstance()}/v2/pixelic-overlay/tags`);
  if (data?.value) {
    console.log(`%c[TagSystem] Updated Tags in ${Date.now() - timer}ms`, "color: #a2d0c0");
    tags = (data.value as any)?.tags || {};
  } else {
    console.error(`%c[TagSystem] Failed updating Tags`, "color: #a2d0c0");
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
