export function generateIds(count: number): string[] {
  if (count <= 0) {
    return [];
  }
  return new Array(count).fill(0).map((_, index) => `c${index}`);
}
