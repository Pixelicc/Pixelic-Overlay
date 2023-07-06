const axios = require("axios");
const PackageJSON = require("./package.json");

const checkForUpdate = async () => {
  var gitUpdate = {
    isLatest: true,
    version: PackageJSON.version,
  };
  try {
    const data = await axios.get("https://api.github.com/repos/pixelicc/pixelic-overlay/releases/latest");
    let tagName = data.data["tag_name"];
    if (tagName.substring(1) !== PackageJSON.version) {
      gitUpdate = {
        isLatest: false,
        version: tagName,
      };
      return gitUpdate;
    }
    return gitUpdate;
  } catch (error) {
    console.error(error);
    return gitUpdate;
  }
};

const isLatest = async () => {
  try {
    const update = await checkForUpdate();
    return update.isLatest;
  } catch {
    return true;
  }
};

module.exports = { isLatest };
