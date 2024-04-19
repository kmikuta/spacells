const EMPTY_SPOT_SIGN = "-";

export class Surface {
  private readonly area: string[][] = [];

  constructor(private readonly rows: number, private readonly cols: number) {
    for (let i = 0; i < rows; i++) {
      this.area[i] = [];
      for (let j = 0; j < cols; j++) {
        this.area[i][j] = EMPTY_SPOT_SIGN;
      }
    }
  }

  public put(cid: string) {
    const [i, j] = this.getRandomFreeSpot();
    this.area[i][j] = cid;
  }

  public getCellMap(): string[][] {
    return this.area;
  }

  private getRandomFreeSpot(): [number, number] {
    let i;
    let j;

    do {
      i = Math.floor(Math.random() * this.rows);
      j = Math.floor(Math.random() * this.cols);
    } while (this.area[i][j] !== "-");

    return [i, j];
  }
}
