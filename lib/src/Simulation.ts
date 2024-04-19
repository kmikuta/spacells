import { Cultures } from "./core/cell/Cultures";
import { Terrain } from "./core/terrain/Terrain";

export class Simulation {
  private readonly terrain: Terrain;
  private readonly cultures: Cultures;

  constructor(terrain: Terrain, cultures: Cultures) {
    this.terrain = terrain;
    this.cultures = cultures;

    this.terrain.putCultures(cultures);
  }

  public step(): void {
    this.cultures.getAll().forEach((c) => c.step());
  }
}
