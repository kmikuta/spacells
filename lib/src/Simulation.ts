import { Cell } from "./core/cultures/Cell";
import { Cultures } from "./core/cultures/Cultures";
import { Terrain } from "./core/terrain/Terrain";

export class Simulation {
  constructor(
    private readonly terrain: Terrain,
    private readonly cultures: Cultures
  ) {}

  public step(): void {
    this.cultures.step();
  }
}
