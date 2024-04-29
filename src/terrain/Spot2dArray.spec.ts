import { beforeEach, describe, expect, it } from "vitest";
import { Spot2dArray } from "./Spot2dArray";
import { Spot } from "./Spot";

const ONE_RESOURCE_PER_SPOT = 1;

describe("Spot2dArray", () => {
  let spot2dArray: Spot2dArray;

  describe("when an array is being created", () => {
    beforeEach(() => {
      spot2dArray = new Spot2dArray(3, 2, ({ i, j }) => Spot.empty({ i, j }, ONE_RESOURCE_PER_SPOT));
    });

    it("should create and initialize an array properly", () => {
      expect(spot2dArray.items).toEqual([
        [
          { address: { i: 0, j: 0 }, occupantId: null, resourceCount: 1 },
          { address: { i: 0, j: 1 }, occupantId: null, resourceCount: 1 },
        ],
        [
          { address: { i: 1, j: 0 }, occupantId: null, resourceCount: 1 },
          { address: { i: 1, j: 1 }, occupantId: null, resourceCount: 1 },
        ],
        [
          { address: { i: 2, j: 0 }, occupantId: null, resourceCount: 1 },
          { address: { i: 2, j: 1 }, occupantId: null, resourceCount: 1 },
        ],
      ]);
    });
  });

  describe("when occupant exists", () => {
    beforeEach(() => {
      spot2dArray = new Spot2dArray(1, 2, ({ i, j }) => Spot.create({ i, j }, `c${j}`, ONE_RESOURCE_PER_SPOT));
    });

    it("should get a spot by occupant id", () => {
      expect(spot2dArray.getByOccupantId("c0")).toEqual({
        address: { i: 0, j: 0 },
        occupantId: "c0",
        resourceCount: 1,
      });
    });
  });

  describe("when occupant does not exist", () => {
    beforeEach(() => {
      spot2dArray = new Spot2dArray(1, 2, ({ i, j }) => Spot.empty({ i, j }, ONE_RESOURCE_PER_SPOT));
    });

    it("should throw an error", () => {
      expect(() => spot2dArray.getByOccupantId("c0")).toThrowError("Cannot find occupant with id: c0");
    });
  });

  describe("when filtering a spot2dArray and item exists", () => {
    beforeEach(() => {
      spot2dArray = new Spot2dArray(1, 2, ({ i, j }) => Spot.create({ i, j }, `c${j}`, ONE_RESOURCE_PER_SPOT));
    });

    it("should return array of results", () => {
      expect(spot2dArray.filter((spot) => spot.occupantId === "c0")).toEqual([
        { address: { i: 0, j: 0 }, occupantId: "c0", resourceCount: 1 },
      ]);
    });
  });

  describe("when filtering a spot2dArray and item does not exist", () => {
    beforeEach(() => {
      spot2dArray = new Spot2dArray(1, 2, ({ i, j }) => Spot.empty({ i, j }, ONE_RESOURCE_PER_SPOT));
    });

    it("should return an empty array", () => {
      expect(spot2dArray.filter((spot) => spot.occupantId === "c0")).toEqual([]);
    });
  });

  describe("when saving an item in a spot2dArray", () => {
    beforeEach(() => {
      spot2dArray = new Spot2dArray(1, 2, ({ i, j }) => Spot.create({ i, j }, `c${j}`, ONE_RESOURCE_PER_SPOT));

      const spot1 = spot2dArray.getByOccupantId("c0");
      const spot2 = spot2dArray.getByOccupantId("c1");
      spot2dArray.save(spot1.setOccupant("c1"));
      spot2dArray.save(spot2.setOccupant("c0"));
    });

    it("should save the item", () => {
      expect(spot2dArray.items).toEqual([
        [
          { address: { i: 0, j: 0 }, occupantId: "c1", resourceCount: 1 },
          { address: { i: 0, j: 1 }, occupantId: "c0", resourceCount: 1 },
        ],
      ]);
    });

    it("should provide the spots with new adresses", () => {
      expect(spot2dArray.getByOccupantId("c0")).toEqual({
        address: { i: 0, j: 1 },
        occupantId: "c0",
        resourceCount: 1,
      });
      expect(spot2dArray.getByOccupantId("c1")).toEqual({
        address: { i: 0, j: 0 },
        occupantId: "c1",
        resourceCount: 1,
      });
    });
  });

  describe("when getting surrounding of an item", () => {
    beforeEach(() => {
      spot2dArray = new Spot2dArray(3, 3, ({ i, j }) => Spot.empty({ i, j }, ONE_RESOURCE_PER_SPOT));
      spot2dArray.save(Spot.create({ i: 1, j: 1 }, "c0", ONE_RESOURCE_PER_SPOT));
      spot2dArray.save(Spot.create({ i: 0, j: 0 }, "c1", ONE_RESOURCE_PER_SPOT));
    });

    it("should return surrounding spots", () => {
      expect(spot2dArray.getSurroundingOfOccupant("c0")).toEqual([
        { address: { i: 0, j: 0 }, occupantId: "c1", resourceCount: 1 },
        { address: { i: 0, j: 1 }, occupantId: null, resourceCount: 1 },
        { address: { i: 0, j: 2 }, occupantId: null, resourceCount: 1 },
        { address: { i: 1, j: 0 }, occupantId: null, resourceCount: 1 },
        { address: { i: 1, j: 2 }, occupantId: null, resourceCount: 1 },
        { address: { i: 2, j: 0 }, occupantId: null, resourceCount: 1 },
        { address: { i: 2, j: 1 }, occupantId: null, resourceCount: 1 },
        { address: { i: 2, j: 2 }, occupantId: null, resourceCount: 1 },
      ]);
    });
  });
});
