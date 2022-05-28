export const isObjectEmpty = (obj: any) => {
  if (!obj) return true;
  return Object.keys(obj).length == 0;
};

export const isNullOrUndefined = (obj: any) => obj === null || obj === undefined;

export const isBoolean = (obj: any) => typeof obj === "boolean";
export const isString = (obj: any) => typeof obj === "string";
export const isNumber = (obj: any) => typeof obj === "number";
export const isScalar = (obj: any) => isBoolean(obj) || isString(obj) || isNumber(obj);

export const isArray = (obj: any) => Array.isArray(obj);
export const isObject = (obj: any) => obj && typeof obj === "object";
export const isPlainObject = (obj: any) =>
  obj && typeof obj === "object" && Object.getPrototypeOf(obj) === Object.prototype;
