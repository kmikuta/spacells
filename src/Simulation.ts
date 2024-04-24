import { Cultures } from "./cultures/Cultures";
import { Terrain } from "./terrain/Terrain";

export class Simulation {
  constructor(
    private readonly terrain: Terrain,
    private readonly cultures: Cultures,
  ) {}

  public step(): void {
    this.cultures.step();
  }
}
