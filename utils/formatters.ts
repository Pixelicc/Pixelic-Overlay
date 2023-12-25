export const formatUUID = (UUID: string) => UUID.replace(/-/g, "").toLowerCase();

export const formatNumber = (number: number, digits: number) => {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "m" },
    { value: 1e9, symbol: "b" },
    { value: 1e12, symbol: "t" },
  ];
  const rx = /.0+$|(.[0-9]*[1-9])0+$/;
  var item = lookup
    .slice()
    .reverse()
    .find((item) => {
      return number >= item.value;
    });
  return item ? (number / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
};
