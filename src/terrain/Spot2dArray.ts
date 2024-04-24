import {
  Index2d,
  create2DArray,
  findIndexIn2DArray,
  findIndexesIn2DArray,
  getSurroundingIn2DArray,
} from "../util/array/array2d";
import { Spot } from "./Spot";

export type SpotAddress = Index2d;

export class Spot2dArray {
  private readonly area: Spot[][] = [];

  constructor(
    public readonly rows: number,
    public readonly cols: number,
    private readonly resourcesPerSpot: number,
  ) {
    this.area = create2DArray(rows, cols, Spot.empty(resourcesPerSpot));
  }

  get items(): Spot[][] {
    return this.area.map((cols) => cols.map((item) => item.copy()));
  }

  // TODO secure for the address out of the grid
  public get({ i, j }: SpotAddress): Spot {
    return this.area[i][j].copy();
  }

  public set({ i, j }: SpotAddress, value: Spot) {
    this.area[i][j] = value.copy();
  }

  public findAddress(predicate: (spot: Spot) => boolean): SpotAddress | null {
    return findIndexIn2DArray(this.area, predicate);
  }

  public findAddresses(predicate: (spot: Spot) => boolean): SpotAddress[] {
    return findIndexesIn2DArray(this.area, predicate);
  }

  public getSurrounding(address: SpotAddress): SpotAddress[] {
    return getSurroundingIn2DArray(address, this.rows, this.cols);
  }
}
