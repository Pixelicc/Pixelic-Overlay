const colors: { [key: string | number]: string } = {
  0: "#000000",
  1: "#0000AA",
  2: "#00AA00",
  3: "#00AAAA",
  4: "#AA0000",
  5: "#AA00AA",
  6: "#FFAA00",
  7: "#AAAAAA",
  8: "#555555",
  9: "#5555FF",
  a: "#55FF55",
  b: "#55FFFF",
  c: "#FF5555",
  d: "#FF55FF",
  e: "#FFFF55",
  f: "#FFFFFF",
};

export const getMCColor = (hex: string) => {
  if (Object.hasOwn(colors, hex)) return colors[hex];
  return "#FFFFFF";
};

export const parseMCColor = (str: string) => {
  var parsedText = "";
  str
    .split("§")
    .slice(1)
    .forEach((parts) => (parsedText += `<span style="color:${colors[parts[0]]}">${parts.split("").slice(1).join("")}</span>`));
  return parsedText;
};
