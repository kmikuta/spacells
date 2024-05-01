import { randomArrayElement } from "../util/array/elements";
import { TerrainFacade } from "../terrain/TerrainFacade";
import { EnergyStore, NotEnoughEnergyError } from "../energy/EnergyStore";

const INITIAL_SIZE = 1;
const INITIAL_ENERGY = 5;
const RESOURCE_INTAKE = 1;
const INNER_PROCESS_ENERGY_RATE = 0.2;
const GROW_PROCESS_ENERGY_RATE = 0.5;
const MIGRATION_PROCESS_ENERGY_RATE = 0.2;
const DIVISION_PROCESS_ENERGY_RATE = 5;
const MINIMAL_SIZE_TO_DIVIDE = 8;

export type DivisionCallback = (newCell: Cell) => void;

export class Cell {
  private readonly energyStore: EnergyStore;
  private size: number;
  private divisionCallback: DivisionCallback = () => {};

  constructor(
    public readonly id: string,
    private readonly terrain: TerrainFacade,
    initialEnergy: number = INITIAL_ENERGY,
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

  private get canDivide(): boolean {
    return this.size >= MINIMAL_SIZE_TO_DIVIDE && this.energyStore.currentValue >= DIVISION_PROCESS_ENERGY_RATE;
  }

  public step() {
    this.executeInnerProcesses();
    this.produceEnergy();
    this.grow();
    this.divide();
  }

  public copy() {
    return new Cell(this.id, this.terrain, this.energy, this.cellSize);
  }

  public onDivision(callback: DivisionCallback) {
    this.divisionCallback = callback;
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

  private divide() {
    if (!this.canDivide) {
      return;
    }

    const freeSpots = this.terrain.getPossibleNextMoves();
    if (freeSpots.length === 0) {
      return;
    }

    const cloneId = `_${this.id}`;
    const clone = new Cell(cloneId, this.terrain.clone(cloneId), INITIAL_ENERGY);
    this.energyStore.utilize(DIVISION_PROCESS_ENERGY_RATE);
    this.terrain.put(clone, randomArrayElement(freeSpots));
    this.divisionCallback(clone);
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
