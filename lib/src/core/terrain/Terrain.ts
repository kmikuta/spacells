export type Spot = { occupantId: string | null; resourceCount: number };

const createInitialSpot = (): Spot => {
  return {
    resourceCount: 10,
    occupantId: null,
  };
};

export class Terrain {
  private readonly area: Spot[][] = [];

  constructor(public readonly width: number, public readonly height: number) {
    for (let i = 0; i < height; i++) {
      this.area[i] = [];
      for (let j = 0; j < width; j++) {
        this.area[i][j] = createInitialSpot();
      }
    }
  }

  public takeSpot(occupantId: string) {
    const [i, j] = this.getRandomFreeSpot();
    this.area[i][j].occupantId = occupantId;
  }

  public consumeResources(occupantId: string, amount: number): number {
    const [i, j] = this.findAddress(occupantId);
    const { resourceCount } = this.area[i][j];
    const consumption = Math.min(resourceCount, amount);
    this.area[i][j].resourceCount -= consumption;
    return consumption;
  }

  public getVisualMatrix(): string[][] {
    return this.area.map((arr) =>
      arr.map((item) => `[${item.occupantId ?? "__"}] (${item.resourceCount})`)
    );
  }

  private findAddress(occupantId: string): [number, number] {
    for (let i = 0; i < this.area.length; i++) {
      for (let j = 0; j < this.area[i].length; j++) {
        if (this.area[i][j].occupantId === occupantId) {
          return [i, j];
        }
      }
    }
    throw new Error(`Cannot find spot for the cell ${occupantId}`);
  }

  private getRandomFreeSpot(): [number, number] {
    let i;
    let j;

    do {
      i = Math.floor(Math.random() * this.height);
      j = Math.floor(Math.random() * this.width);
    } while (this.area[i][j].occupantId !== null);

    return [i, j];
  }
}
