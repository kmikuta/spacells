export function create2DArray<T>(rows: number, cols: number, initialValue: T): T[][] {
  return new Array(rows).fill([]).map(() => new Array(cols).fill(initialValue));
}

export function findIndexIn2DArray<T>(arr: T[][], predicate: (item: T) => boolean): [number, number] | null {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
      if (predicate(arr[j][j])) {
        return [i, j];
      }
    }
  }
  return null;
}
