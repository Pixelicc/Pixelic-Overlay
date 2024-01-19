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

export const queryJSONPath = (obj: any, JSONPath: string) => {
  if (!validateJSONPath(JSONPath)) throw new Error("Invalid JSONPath expression");

  const parts = JSONPath.slice(2).split(".");
  var current = obj;

  for (const part of parts) {
    const match = part.match(/(\w+)(?:\[(\d+)\])?/);
    if (!match) throw new Error("Invalid JSONPath expression");
    const [_, key, index] = match;
    current = current[key];
    if (index !== undefined) current = current[index];
    if (current === undefined) throw new Error("Invalid JSONPath expression");
  }

  return current;
};
