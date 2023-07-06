export default function (star) {
  const prestigeColors = [
    { req: 0, fn: (n) => `§7[${n}✫]` },
    { req: 100, fn: (n) => `§f[${n}✫]` },
    { req: 200, fn: (n) => `§6[${n}✫]` },
    { req: 300, fn: (n) => `§b[${n}✫]` },
    { req: 400, fn: (n) => `§2[${n}✫]` },
    { req: 500, fn: (n) => `§3[${n}✫]` },
    { req: 600, fn: (n) => `§4[${n}✫]` },
    { req: 700, fn: (n) => `§d[${n}✫]` },
    { req: 800, fn: (n) => `§9[${n}✫]` },
    { req: 900, fn: (n) => `§5[${n}✫]` },
    {
      req: 1000,
      fn: (n) => {
        const nums = n.toString().split("");
        return `§c[§6${nums[0]}§e${nums[1]}§a${nums[2]}§b${nums[3]}§d✫§5]`;
      },
    },
    { req: 1100, fn: (n) => `§7[§f${n}§7✪]` },
    { req: 1200, fn: (n) => `§7[§e${n}§6✪§7]` },
    { req: 1300, fn: (n) => `§7[§b${n}§3✪§7]` },
    { req: 1400, fn: (n) => `§7[§a${n}§2✪§7]` },
    { req: 1500, fn: (n) => `§7[§3${n}§9✪§7]` },
    { req: 1600, fn: (n) => `§7[§c${n}§4✪§7]` },
    { req: 1700, fn: (n) => `§7[§d${n}§5✪§7]` },
    { req: 1800, fn: (n) => `§7[§9${n}§1✪§7]` },
    { req: 1900, fn: (n) => `§7[§5${n}§8✪§7]` },
    {
      req: 2000,
      fn: (n) => {
        const nums = n.toString().split("");
        return `§8[§7${nums[0]}§f${nums[1]}${nums[2]}§7${nums[3]}§8✪]`;
      },
    },
    {
      req: 2100,
      fn: (n) => {
        const nums = n.toString().split("");
        return `§f[${nums[0]}§e${nums[1]}${nums[2]}§6${nums[3]}⚝]`;
      },
    },
    {
      req: 2200,
      fn: (n) => {
        const nums = n.toString().split("");
        return `§6[${nums[0]}§f${nums[1]}${nums[2]}§b${nums[3]}§3⚝]`;
      },
    },
    {
      req: 2300,
      fn: (n) => {
        const nums = n.toString().split("");
        return `§5[${nums[0]}§d${nums[1]}${nums[2]}§6${nums[3]}§e⚝]`;
      },
    },
    {
      req: 2400,
      fn: (n) => {
        const nums = n.toString().split("");
        return `§b[${nums[0]}§f${nums[1]}${nums[2]}§7${nums[3]}⚝§8]`;
      },
    },
    {
      req: 2500,
      fn: (n) => {
        const nums = n.toString().split("");
        return `§f[${nums[0]}§a${nums[1]}${nums[2]}§2${nums[3]}⚝]`;
      },
    },
    {
      req: 2600,
      fn: (n) => {
        const nums = n.toString().split("");
        return `§4[${nums[0]}§c${nums[1]}${nums[2]}§d${nums[3]}§5⚝]`;
      },
    },
    {
      req: 2700,
      fn: (n) => {
        const nums = n.toString().split("");
        return `§e[${nums[0]}§f${nums[1]}${nums[2]}§8${nums[3]}⚝]`;
      },
    },
    {
      req: 2800,
      fn: (n) => {
        const nums = n.toString().split("");
        return `§a[${nums[0]}§2${nums[1]}${nums[2]}§6${nums[3]}⚝§e]`;
      },
    },
    {
      req: 2900,
      fn: (n) => {
        const nums = n.toString().split("");
        return `§b[${nums[0]}§3${nums[1]}${nums[2]}§9${nums[3]}⚝§1]`;
      },
    },
    {
      req: 3000,
      fn: (n) => {
        const nums = n.toString().split("");
        return `§e[${nums[0]}§6${nums[1]}${nums[2]}§c${nums[3]}⚝§4]`;
      },
    },
    {
      req: 3100,
      fn: (n) => {
        const nums = n.toString().split("");
        return `§9[${nums[0]}§2${nums[1]}${nums[2]}§6${nums[3]}✥§e]`;
      },
    },
    {
      req: 3200,
      fn: (n) => {
        const nums = n.toString().split("");
        return `§c[§4${nums[0]}§7${nums[1]}${nums[2]}§4${nums[3]}§c✥§c]`;
      },
    },
    {
      req: 3300,
      fn: (n) => {
        const nums = n.toString().split("");
        return `§9[${nums[0]}${nums[1]}§d${nums[2]}§c${nums[3]}✥§4]`;
      },
    },
    {
      req: 3400,
      fn: (n) => {
        const nums = n.toString().split("");
        return `§2[§a${nums[0]}§d${nums[1]}${nums[2]}§5${nums[3]}✥§2]`;
      },
    },
    {
      req: 3500,
      fn: (n) => {
        const nums = n.toString().split("");
        return `§c[${nums[0]}§4${nums[1]}${nums[2]}§2${nums[3]}§a✥§a]`;
      },
    },
    {
      req: 3600,
      fn: (n) => {
        const nums = n.toString().split("");
        return `§a[${nums[0]}${nums[1]}§b${nums[2]}§9${nums[3]}✥§1]`;
      },
    },
    {
      req: 3700,
      fn: (n) => {
        const nums = n.toString().split("");
        return `§4[${nums[0]}§c${nums[1]}${nums[2]}§b${nums[3]}§3✥§3]`;
      },
    },
    {
      req: 3800,
      fn: (n) => {
        const nums = n.toString().split("");
        return `§1[${nums[0]}§9${nums[1]}§5${nums[2]}${nums[3]}§d✥§1]`;
      },
    },
    {
      req: 3900,
      fn: (n) => {
        const nums = n.toString().split("");
        return `§c[${nums[0]}§a${nums[1]}${nums[2]}§3${nums[3]}§9✥§9]`;
      },
    },
    {
      req: 4000,
      fn: (n) => {
        const nums = n.toString().split("");
        return `§5[${nums[0]}§c${nums[1]}${nums[2]}§6${nums[3]}✥§e]`;
      },
    },
    {
      req: 4100,
      fn: (n) => {
        const nums = n.toString().split("");
        return `§e[${nums[0]}§6${nums[1]}§c${nums[2]}§d${nums[3]}✥§5]`;
      },
    },
    {
      req: 4200,
      fn: (n) => {
        const nums = n.toString().split("");
        return `§1[§9${nums[0]}§3${nums[1]}§5${nums[2]}${nums[3]}§d✥§1]`;
      },
    },
    {
      req: 4300,
      fn: (n) => {
        const nums = n.toString().split("");
        return `§0[§5${nums[0]}§8${nums[1]}${nums[2]}§5${nums[3]}✥§0]`;
      },
    },
    {
      req: 4400,
      fn: (n) => {
        const nums = n.toString().split("");
        return `§2[${nums[0]}§a${nums[1]}§e${nums[2]}§6${nums[3]}§5✥§d]`;
      },
    },
    {
      req: 4500,
      fn: (n) => {
        const nums = n.toString().split("");
        return `§f[${nums[0]}§b${nums[1]}${nums[2]}§2${nums[3]}✥§2]`;
      },
    },
    {
      req: 4600,
      fn: (n) => {
        const nums = n.toString().split("");
        return `§2[§b${nums[0]}§e${nums[1]}${nums[2]}§6${nums[3]}§d✥§5]`;
      },
    },
    {
      req: 4700,
      fn: (n) => {
        const nums = n.toString().split("");
        return `§f[§4${nums[0]}§c${nums[1]}${nums[2]}§9${nums[3]}§1✥§9]`;
      },
    },
    {
      req: 4800,
      fn: (n) => {
        const nums = n.toString().split("");
        return `§5[${nums[0]}§c${nums[1]}§6${nums[2]}§e${nums[3]}§b✥§3]`;
      },
    },
    {
      req: 4900,
      fn: (n) => {
        const nums = n.toString().split("");
        return `§2[§a${nums[0]}§f${nums[1]}${nums[2]}§a${nums[3]}✥§2]`;
      },
    },
    {
      req: 5000,
      fn: (n) => {
        const nums = n.toString().split("");
        return `§4[${nums[0]}§5${nums[1]}§9${nums[2]}${nums[3]}§1✥§0]`;
      },
    },
  ];

  const index = prestigeColors.findIndex(({ req }, index, arr) => star >= req && (arr[index + 1] && star < arr[index + 1].req) | !arr[index + 1]);
  return prestigeColors[index].fn(star);
}
