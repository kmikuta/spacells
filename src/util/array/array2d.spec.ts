import { describe, expect, it } from "vitest";
import { create2DArray, findIndexIn2DArray, findIndexesIn2DArray, getSurroundingIn2DArray } from "./array2d";

describe("array2d utils", () => {
  it("should create and fill a 2d array", () => {
    expect(create2DArray(3, 4, "o")).toEqual([
      ["o", "o", "o", "o"],
      ["o", "o", "o", "o"],
      ["o", "o", "o", "o"],
    ]);
  });

  it("should find the index of an item in a 2d array", () => {
    expect(
      findIndexIn2DArray(
        [
          [1, 2, 3],
          [4, 5, 6],
        ],
        (item) => item === 5,
      ),
    ).toEqual({ i: 1, j: 1 });
  });

  it("should return null if the item is not found in a 2d array", () => {
    expect(
      findIndexIn2DArray(
        [
          [1, 2, 3],
          [4, 5, 6],
        ],
        (item) => item === 7,
      ),
    ).toBeNull();
  });

  it("should find all indexes of an item in a 2d array", () => {
    expect(
      findIndexesIn2DArray(
        [
          [1, 2, 3],
          [4, 5, 6],
          [5, 5, 5],
        ],
        (item) => item === 5,
      ),
    ).toEqual([
      { i: 1, j: 1 },
      { i: 2, j: 0 },
      { i: 2, j: 1 },
      { i: 2, j: 2 },
    ]);
  });

  it("should return an empty array if the item is not found in a 2d array", () => {
    expect(
      findIndexesIn2DArray(
        [
          [1, 2, 3],
          [4, 5, 6],
        ],
        (item) => item === 7,
      ),
    ).toEqual([]);
  });

  it("should get the surrounding indexes of a point in a 2d array", () => {
    /**
     * 0 0 0
     * 0 1 0
     * 0 0 0
     */
    expect(getSurroundingIn2DArray({ i: 1, j: 1 }, 3, 3)).toEqual([
      { i: 0, j: 0 },
      { i: 0, j: 1 },
      { i: 0, j: 2 },
      { i: 1, j: 0 },
      { i: 1, j: 2 },
      { i: 2, j: 0 },
      { i: 2, j: 1 },
      { i: 2, j: 2 },
    ]);
  });

  it("should get the surrounding indexes of a point at the edge of a 2d array", () => {
    /**
     * 1 0 0
     * 0 0 0
     * 0 0 0
     */
    expect(getSurroundingIn2DArray({ i: 0, j: 0 }, 3, 3)).toEqual([
      { i: 0, j: 1 },
      { i: 1, j: 0 },
      { i: 1, j: 1 },
    ]);
  });

  it("should get the surrounding indexes of a point at the edge of a 2d array with different dimensions", () => {
    /**
     * 1 0 0 0
     * 0 0 0 0
     * 0 0 0 0
     */
    expect(getSurroundingIn2DArray({ i: 0, j: 0 }, 3, 4)).toEqual([
      { i: 0, j: 1 },
      { i: 1, j: 0 },
      { i: 1, j: 1 },
    ]);
  });
});
