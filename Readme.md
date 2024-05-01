# Spacells - bacteria life simulation project

Inspired by the project [Hello Worlds - Virtual javascript worlds at planetary scales](https://github.com/kenjinp/hello-worlds), Spacells is a simulation library that brings micro life to your virtual world. It introduces the concept of bacteria cultures that can occupy areas, grow, consume resources, reproduce, compete and make decisions. Most of the features follow the principles of real life bacteria, but can be simplified or extended to make it more fun. The scientific papers in the area of cell biology or computer science will be mentioned in the documentation when more sophisticated methods are used in the simulation. Simulations are based on steps, where each one is a turn in which the system analyzes the conditions and changes its state. The library is written in Typescript and can be used in javascript projects. If you are interested in creating a virtual world with bacteria, this library is for you!

Next-gen organisms are coming! If the simulations prove to be useful, the library will be extended to support more complex organisms like plants, animals, and even civilizations.

## PoC phase

The project is in the early development stage and is not ready for production use. The API is not stable and can change at any time.

## Current features

- Bacteria has position and can be observed
- Bacteria consumes resources
- Bacteria migrates to look for resources
- Bacteria grows
- Bacteria reproduces

## Planned features

- Bacteria has reporoductive strategy
- Bacteria communicates via signals

## Ideas

- Bacteria fights the other bacteria
- Bacteria cooperates with others
- Mutagens in the environment can change bacteria features

## Setup

- `make install` - install dependencies
- `make build` - build the project
- `make test` - run tests

## Usage

```javascript
import { CellFactory, Simulation, TerrainFactory, generateIds } from "@spacells/core";

const terrain = TerrainFactory.createTerrain({ width: 10, height: 10, resourcesPerSpot: 10 });
const cells = generateIds(100).map((id) => CellFactory.createCell(terrain, { id }));
const simulation = new Simulation(terrain, cells);

for (let i = 0; i < 10; i++) {
  simulation.step();
}
```
