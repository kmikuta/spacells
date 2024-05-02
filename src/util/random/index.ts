const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export function randomInt(max: number): number {
  return Math.floor(Math.random() * max);
}

export function randomStr(length: number): string {
  return Array.from({ length }, () => chars[randomInt(chars.length)]).join("");
}
