import { Cultures } from "../cell/Cultures";
import { Surface } from "./Surface";

export class Terrain {
  private readonly surface: Surface;

  constructor(public readonly width: number, public readonly height: number) {
    this.surface = new Surface(height, width);
  }

  public getVisualMatrix(): string[][] {
    return this.surface.getCellMap();
  }

  public putCultures(cultures: Cultures) {
    cultures.getAll().forEach((c) => {
      this.surface.put(c.id);
    });
  }
}
