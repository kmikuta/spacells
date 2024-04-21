import { randomInt } from "../random";

export function randomArrayElement<T>(arr: T[]): T {
  return arr[randomInt(arr.length)];
}
