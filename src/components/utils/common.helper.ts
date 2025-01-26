import { v4 as uuidv4 } from "uuid";

export const generateUUID = (): string => {
  return uuidv4();
};

// TODO: make the function more typescript generic friendly
export const toDictionary = (
  array: any[],
  primaryKey: string,
  valueKey: string,
): { [k: string]: any } => {
  return array.reduce((accumulator, currentValue) => {
    const k = currentValue[primaryKey];
    const v = currentValue[valueKey];
    accumulator[k] = v;
    return accumulator;
  }, {});
};
