export type Index2d = {
  i: number;
  j: number;
};

export function create2DArray<T>(rows: number, cols: number, initialValueFactory: (index: Index2d) => T): T[][] {
  const arr = new Array(rows);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(cols);
    for (let j = 0; j < arr[i].length; j++) {
      arr[i][j] = initialValueFactory({ i, j });
    }
  }
  return arr;
}

export function findIndexIn2DArray<T>(arr: T[][], predicate: (item: T) => boolean): Index2d | null {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
      if (predicate(arr[i][j])) {
        return { i, j };
      }
    }
  }
  return null;
}

export function findIndexesIn2DArray<T>(arr: T[][], predicate: (item: T) => boolean): Index2d[] {
  const result: Index2d[] = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
      if (predicate(arr[i][j])) {
        result.push({ i, j });
      }
    }
  }
  return result;
}

export function getSurroundingIn2DArray(point: Index2d, rows: number, cols: number): Index2d[] {
  const { i, j } = point;
  const iValues = [i - 1, i, i + 1].filter((i) => i >= 0 && i < rows);
  const jValues = [j - 1, j, j + 1].filter((j) => j >= 0 && j < cols);

  return iValues
    .map((ival) => jValues.map((jval) => ({ i: ival, j: jval })))
    .flat()
    .filter(({ i, j }) => !(i === point.i && j === point.j));
}
