import axios from "axios";

var customTags = {};

const updateData = async () => {
  try {
    customTags = (
      await axios.get("https://api.pixelic.de/hypixel/v1/overlay/tags", {
        headers: {
          "Cache-Control": "no-cache",
          Expires: "0",
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
}, 15 * 60 * 1000);

export default function (UUID) {
  if (UUID === undefined) return "";
  if (customTags[UUID.replace(/-/g, "")] !== undefined) {
    return customTags[UUID.replace(/-/g, "")];
  }
  return "";
}
