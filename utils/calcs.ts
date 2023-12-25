export const getRatio = (a: number, b: number) => {
  if (b === 0) return a;
  return a / b;
};

export const reverseObject = (obj: any) => {
  const reversedObj: any = {};
  Object.entries(obj).forEach(([key, value]: [key: any, value: any]) => {
    reversedObj[value] = key;
  });
  return reversedObj;
};
