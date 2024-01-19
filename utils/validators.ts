export const validateUUID = (UUID: string) => {
  if (typeof UUID !== "string") return false;
  UUID = formatUUID(UUID);
  if (UUID.length !== 32) return false;
  return /[0-9a-f]{12}4[0-9a-f]{19}/.test(UUID);
};

export const validateUsername = (username: string) => {
  if (typeof username !== "string") return false;
  return /^[a-zA-Z0-9_]{2,16}$/.test(username);
};

export const validateHexID = (ID: string, length: number) => {
  return new RegExp(`^[a-fA-F0-9]{${length}}$`).test(ID);
};

export const validateURL = (URLString: string) => {
  try {
    const URLObject = new URL(URLString);
    return URLObject.protocol === "http:" || URLObject.protocol === "https:";
  } catch (err) {
    return false;
  }
};

export const validateJSONPath = (path: string) => {
  if (typeof path !== "string") return false;
  return /^(\$|(\.[a-zA-Z_$][a-zA-Z0-9_$]*|\['[^']*'\]|\[\d+\]))+$/.test(path);
};
