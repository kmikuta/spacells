import { create2DArray, findIndexIn2DArray } from "./util/arrays";
import { Spot } from "./Spot";

export type SpotAddress = [number, number];

export class Spot2dArray {
  private readonly area: Spot[][] = [];

  constructor(public readonly rows: number, public readonly cols: number) {
    this.area = create2DArray(rows, cols, Spot.empty());
  }

  public get([i, j]: SpotAddress): Spot {
    return this.area[i][j];
  }

  public set([i, j]: SpotAddress, value: Spot) {
    this.area[i][j] = value;
  }

  public getAddress(predicate: (spot: Spot) => boolean): SpotAddress {
    const index = findIndexIn2DArray(this.area, predicate);
    if (index === null) {
      throw new Error("Cannot find address by predicate.");
    }
    return index;
  }

  public toStringArray(): string[][] {
    return this.area.map((arr) => arr.map((item) => item.toString()));
  }
}
