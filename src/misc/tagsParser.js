import axios from "axios";

var customTags = {};

const updateData = async () => {
  try {
    customTags = (
      await axios.get("https://api.pixelic.de/hypixel/v1/overlay/tags", {
        headers: {
          "cache-control": "no-cache",
        },
      })
    ).data.tags;
  } catch (error) {
    console.error(error);
  }
};

updateData().then(() => {});

setInterval(async () => {
  await updateData();
}, 5 * 60 * 1000);

export default (UUID) => {
  if (UUID === undefined) return "";
  if (customTags[UUID.replace(/-/g, "")] !== undefined) {
    return customTags[UUID.replace(/-/g, "")];
  }
  return "";
};
