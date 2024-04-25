import { randomArrayElement } from "../util/array/elements";
import { TerrainFacade } from "../terrain/TerrainFacade";
import { EnergyStore, NotEnoughEnergyError } from "../energy/EnergyStore";

const INITIAL_SIZE = 1;
const RESOURCE_INTAKE = 1;
const INNER_PROCESS_ENERGY_RATE = 0.2;
const GROW_PROCESS_ENERGY_RATE = 0.5;
const MIGRATION_PROCESS_ENERGY_RATE = 0.2;

export class Cell {
  private readonly energyStore: EnergyStore;
  private size: number;

  constructor(
    public readonly id: string,
    private readonly terrain: TerrainFacade,
    initialEnergy: number,
    initialSize: number = INITIAL_SIZE,
  ) {
    this.energyStore = new EnergyStore(initialEnergy);
    this.size = initialSize;
  }

  get energy(): number {
    return this.energyStore.currentValue;
  }

  get cellSize(): number {
    return this.size;
  }

  public step() {
    this.executeInnerProcesses();
    this.produceEnergy();
    this.grow();
  }

  public copy() {
    return new Cell(this.id, this.terrain, this.energy, this.cellSize);
  }

  private executeInnerProcesses() {
    try {
      this.energyStore.utilize(INNER_PROCESS_ENERGY_RATE);
    } catch (e: unknown) {
      if (e instanceof NotEnoughEnergyError) {
        // consider changing the reproduction strategy
      }
    }
  }

  private produceEnergy() {
    // This should be a negative feedback loop instead of a discrete 0/1
    if (!this.energyStore.needsEnergy()) {
      return;
    }
    const consumed = this.consume();
    this.energyStore.add(consumed);
  }

  private consume() {
    const consumed = this.terrain.consume(RESOURCE_INTAKE);

    if (consumed === 0) {
      this.move();
      return 0;
    }

    return consumed;
  }

  private grow() {
    try {
      this.energyStore.utilize(GROW_PROCESS_ENERGY_RATE);
      this.size += GROW_PROCESS_ENERGY_RATE;
    } catch (e: unknown) {
      if (e instanceof NotEnoughEnergyError) {
        // consider changing the reproduction strategy
      }
    }
  }

  private move() {
    const nextMoves = this.terrain.getPossibleNextMoves();
    if (nextMoves.length === 0) {
      return;
    }

    const nextMove = randomArrayElement(nextMoves);
    try {
      this.energyStore.utilize(MIGRATION_PROCESS_ENERGY_RATE);
      this.terrain.moveToSpot(nextMove);
    } catch (e: unknown) {
      if (e instanceof NotEnoughEnergyError) {
        // consider changing the reproduction strategy
      }
    }
  }
}
