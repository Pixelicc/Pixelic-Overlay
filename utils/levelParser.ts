export const parseBedwarsStar = (star: number) => {
  star = Math.floor(star);

  const prestigeColors = [
    { req: 0, parse: (star: number) => `§7[${star}✫]` },
    { req: 100, parse: (star: number) => `§f[${star}✫]` },
    { req: 200, parse: (star: number) => `§6[${star}✫]` },
    { req: 300, parse: (star: number) => `§b[${star}✫]` },
    { req: 400, parse: (star: number) => `§2[${star}✫]` },
    { req: 500, parse: (star: number) => `§3[${star}✫]` },
    { req: 600, parse: (star: number) => `§4[${star}✫]` },
    { req: 700, parse: (star: number) => `§d[${star}✫]` },
    { req: 800, parse: (star: number) => `§9[${star}✫]` },
    { req: 900, parse: (star: number) => `§5[${star}✫]` },
    {
      req: 1000,
      parse: (star: number) => {
        const nums = star.toString().split("");
        return `§c[§6${nums[0]}§e${nums[1]}§a${nums[2]}§b${nums[3]}§d✫§5]`;
      },
    },
    { req: 1100, parse: (star: number) => `§7[§f${star}§7✪]` },
    { req: 1200, parse: (star: number) => `§7[§e${star}§6✪§7]` },
    { req: 1300, parse: (star: number) => `§7[§b${star}§3✪§7]` },
    { req: 1400, parse: (star: number) => `§7[§a${star}§2✪§7]` },
    { req: 1500, parse: (star: number) => `§7[§3${star}§9✪§7]` },
    { req: 1600, parse: (star: number) => `§7[§c${star}§4✪§7]` },
    { req: 1700, parse: (star: number) => `§7[§d${star}§5✪§7]` },
    { req: 1800, parse: (star: number) => `§7[§9${star}§1✪§7]` },
    { req: 1900, parse: (star: number) => `§7[§5${star}§8✪§7]` },
    {
      req: 2000,
      parse: (star: number) => {
        const nums = star.toString().split("");
        return `§8[§7${nums[0]}§f${nums[1]}${nums[2]}§7${nums[3]}§8✪]`;
      },
    },
    {
      req: 2100,
      parse: (star: number) => {
        const nums = star.toString().split("");
        return `§f[${nums[0]}§e${nums[1]}${nums[2]}§6${nums[3]}⚝]`;
      },
    },
    {
      req: 2200,
      parse: (star: number) => {
        const nums = star.toString().split("");
        return `§6[${nums[0]}§f${nums[1]}${nums[2]}§b${nums[3]}§3⚝]`;
      },
    },
    {
      req: 2300,
      parse: (star: number) => {
        const nums = star.toString().split("");
        return `§5[${nums[0]}§d${nums[1]}${nums[2]}§6${nums[3]}§e⚝]`;
      },
    },
    {
      req: 2400,
      parse: (star: number) => {
        const nums = star.toString().split("");
        return `§b[${nums[0]}§f${nums[1]}${nums[2]}§7${nums[3]}⚝§8]`;
      },
    },
    {
      req: 2500,
      parse: (star: number) => {
        const nums = star.toString().split("");
        return `§f[${nums[0]}§a${nums[1]}${nums[2]}§2${nums[3]}⚝]`;
      },
    },
    {
      req: 2600,
      parse: (star: number) => {
        const nums = star.toString().split("");
        return `§4[${nums[0]}§c${nums[1]}${nums[2]}§d${nums[3]}§5⚝]`;
      },
    },
    {
      req: 2700,
      parse: (star: number) => {
        const nums = star.toString().split("");
        return `§e[${nums[0]}§f${nums[1]}${nums[2]}§8${nums[3]}⚝]`;
      },
    },
    {
      req: 2800,
      parse: (star: number) => {
        const nums = star.toString().split("");
        return `§a[${nums[0]}§2${nums[1]}${nums[2]}§6${nums[3]}⚝§e]`;
      },
    },
    {
      req: 2900,
      parse: (star: number) => {
        const nums = star.toString().split("");
        return `§b[${nums[0]}§3${nums[1]}${nums[2]}§9${nums[3]}⚝§1]`;
      },
    },
    {
      req: 3000,
      parse: (star: number) => {
        const nums = star.toString().split("");
        return `§e[${nums[0]}§6${nums[1]}${nums[2]}§c${nums[3]}⚝§4]`;
      },
    },
    {
      req: 3100,
      parse: (star: number) => {
        const nums = star.toString().split("");
        return `§9[${nums[0]}§2${nums[1]}${nums[2]}§6${nums[3]}✥§e]`;
      },
    },
    {
      req: 3200,
      parse: (star: number) => {
        const nums = star.toString().split("");
        return `§c[§4${nums[0]}§7${nums[1]}${nums[2]}§4${nums[3]}§c✥§c]`;
      },
    },
    {
      req: 3300,
      parse: (star: number) => {
        const nums = star.toString().split("");
        return `§9[${nums[0]}${nums[1]}§d${nums[2]}§c${nums[3]}✥§4]`;
      },
    },
    {
      req: 3400,
      parse: (star: number) => {
        const nums = star.toString().split("");
        return `§2[§a${nums[0]}§d${nums[1]}${nums[2]}§5${nums[3]}✥§2]`;
      },
    },
    {
      req: 3500,
      parse: (star: number) => {
        const nums = star.toString().split("");
        return `§c[${nums[0]}§4${nums[1]}${nums[2]}§2${nums[3]}§a✥§a]`;
      },
    },
    {
      req: 3600,
      parse: (star: number) => {
        const nums = star.toString().split("");
        return `§a[${nums[0]}${nums[1]}§b${nums[2]}§9${nums[3]}✥§1]`;
      },
    },
    {
      req: 3700,
      parse: (star: number) => {
        const nums = star.toString().split("");
        return `§4[${nums[0]}§c${nums[1]}${nums[2]}§b${nums[3]}§3✥§3]`;
      },
    },
    {
      req: 3800,
      parse: (star: number) => {
        const nums = star.toString().split("");
        return `§1[${nums[0]}§9${nums[1]}§5${nums[2]}${nums[3]}§d✥§1]`;
      },
    },
    {
      req: 3900,
      parse: (star: number) => {
        const nums = star.toString().split("");
        return `§c[${nums[0]}§a${nums[1]}${nums[2]}§3${nums[3]}§9✥§9]`;
      },
    },
    {
      req: 4000,
      parse: (star: number) => {
        const nums = star.toString().split("");
        return `§5[${nums[0]}§c${nums[1]}${nums[2]}§6${nums[3]}✥§e]`;
      },
    },
    {
      req: 4100,
      parse: (star: number) => {
        const nums = star.toString().split("");
        return `§e[${nums[0]}§6${nums[1]}§c${nums[2]}§d${nums[3]}✥§5]`;
      },
    },
    {
      req: 4200,
      parse: (star: number) => {
        const nums = star.toString().split("");
        return `§1[§9${nums[0]}§3${nums[1]}§5${nums[2]}${nums[3]}§d✥§1]`;
      },
    },
    {
      req: 4300,
      parse: (star: number) => {
        const nums = star.toString().split("");
        return `§0[§5${nums[0]}§8${nums[1]}${nums[2]}§5${nums[3]}✥§0]`;
      },
    },
    {
      req: 4400,
      parse: (star: number) => {
        const nums = star.toString().split("");
        return `§2[${nums[0]}§a${nums[1]}§e${nums[2]}§6${nums[3]}§5✥§d]`;
      },
    },
    {
      req: 4500,
      parse: (star: number) => {
        const nums = star.toString().split("");
        return `§f[${nums[0]}§b${nums[1]}${nums[2]}§2${nums[3]}✥§2]`;
      },
    },
    {
      req: 4600,
      parse: (star: number) => {
        const nums = star.toString().split("");
        return `§2[§b${nums[0]}§e${nums[1]}${nums[2]}§6${nums[3]}§d✥§5]`;
      },
    },
    {
      req: 4700,
      parse: (star: number) => {
        const nums = star.toString().split("");
        return `§f[§4${nums[0]}§c${nums[1]}${nums[2]}§9${nums[3]}§1✥§9]`;
      },
    },
    {
      req: 4800,
      parse: (star: number) => {
        const nums = star.toString().split("");
        return `§5[${nums[0]}§c${nums[1]}§6${nums[2]}§e${nums[3]}§b✥§3]`;
      },
    },
    {
      req: 4900,
      parse: (star: number) => {
        const nums = star.toString().split("");
        return `§2[§a${nums[0]}§f${nums[1]}${nums[2]}§a${nums[3]}✥§2]`;
      },
    },
    {
      req: 5000,
      parse: (star: number) => {
        const nums = star.toString().split("");
        return `§4[${nums[0]}§5${nums[1]}§9${nums[2]}${nums[3]}§1✥§0]`;
      },
    },
  ];

  const index = prestigeColors.findIndex(({ req }, index, arr) => (star >= req && arr[index + 1] && star < arr[index + 1].req) || !arr[index + 1]);
  return { full: prestigeColors[index].parse(star), shortened: prestigeColors[index].parse(star).replaceAll("[", "").replace("[", "").replace("]", "") };
};

export const parseSkywarsStar = (star: number) => {
  star = Math.floor(star);

  const prestigeColors = [
    { req: 0, parse: (star: number) => `§7[${star}⋆]` },
    { req: 5, parse: (star: number) => `§f[${star}✙]` },
    { req: 10, parse: (star: number) => `§6[${star}❤]` },
    { req: 20, parse: (star: number) => `§b[${star}✦]` },
    { req: 25, parse: (star: number) => `§2[${star}✌]` },
    { req: 30, parse: (star: number) => `§3[${star}❦]` },
    { req: 35, parse: (star: number) => `§4[${star}✵]` },
    { req: 40, parse: (star: number) => `§d[${star}❣]` },
    { req: 45, parse: (star: number) => `§9[${star}☯]` },
    {
      req: 50,
      parse: (star: number) => {
        const nums = star.toString().split("");
        return `§c[§6${nums[0]}§e${nums[1]}§a✺§b]`;
      },
    },
    { req: 55, parse: (star: number) => `§7[${star}✈]` },
    { req: 60, parse: (star: number) => `§4[§c${star}⚰§4]` },
    { req: 65, parse: (star: number) => `§c[§f${star}✠§c]` },
    { req: 70, parse: (star: number) => `§e[§6${star}♕§e]` },
    { req: 75, parse: (star: number) => `§7[§9${star}⚡§7]` },
    { req: 80, parse: (star: number) => `§7[§b${star}⁂§7]` },
    { req: 85, parse: (star: number) => `§7[§3${star}✰§7]` },
    { req: 90, parse: (star: number) => `§a[§3${star}⁑§a]` },
    { req: 95, parse: (star: number) => `§c[§e${star}☢§c]` },
    { req: 100, parse: (star: number) => `§9[§1${star}✥§9]` },
    { req: 105, parse: (star: number) => `§6[§4${star}♝§6]` },
    { req: 110, parse: (star: number) => `§5[§b${star}♆§5]` },
    { req: 115, parse: (star: number) => `§8[§7${star}☁§8]` },
    { req: 120, parse: (star: number) => `§d[§5${star}⍟§d]` },
    { req: 125, parse: (star: number) => `§7[§e${star}♗§7]` },
    { req: 130, parse: (star: number) => `§c[§e${star}♔§c]` },
    { req: 135, parse: (star: number) => `§6[§c${star}♞§6]` },
    { req: 140, parse: (star: number) => `§a[§c${star}✏§a]` },
    { req: 145, parse: (star: number) => `§a[§b${star}❈§a]` },
    {
      req: 150,
      parse: (star: number) => {
        const nums = star.toString().split("");
        return `§c[§6${nums[0]}§e${nums[1]}§a${nums[2]}§bಠ§d_§5ಠ§c]`;
      },
    },
  ];

  const index = prestigeColors.findIndex(({ req }, index, arr) => (star >= req && arr[index + 1] && star < arr[index + 1].req) || !arr[index + 1]);
  return {
    full: prestigeColors[index].parse(star),
    shortened: prestigeColors[index].parse(star).replace("[", "").replace("]", ""),
  };
};
