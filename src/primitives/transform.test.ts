import { describe, expect, it } from "vitest";
import type { Point } from "../types";
import { lerpPointToPerspective } from "./transform";

describe("lerpPointToPerspective", () => {
  it("should return the original point when t = 0", () => {
    const p: Point = [10, 20];
    const perspective: Point = [50, 80];
    const result = lerpPointToPerspective(p, perspective, 0);

    expect(result).toEqual([10, 20]);
  });

  it("should return the perspective point when t = 1", () => {
    const p: Point = [10, 20];
    const perspective: Point = [50, 80];
    const result = lerpPointToPerspective(p, perspective, 1);

    expect(result).toEqual([50, 80]);
  });

  it("should interpolate correctly at t = 0.5", () => {
    const p: Point = [0, 0];
    const perspective: Point = [10, 20];
    const result = lerpPointToPerspective(p, perspective, 0.5);

    expect(result).toEqual([5, 10]);
  });

  it("should handle negative coordinates", () => {
    const p: Point = [-10, -5];
    const perspective: Point = [10, 15];
    const result = lerpPointToPerspective(p, perspective, 0.5);

    expect(result).toEqual([0, 5]);
  });

  it("should handle fractional interpolation values", () => {
    const p: Point = [0, 0];
    const perspective: Point = [100, 200];
    const result = lerpPointToPerspective(p, perspective, 0.25);

    expect(result).toEqual([25, 50]);
  });

  it("should handle interpolation beyond 1 (extrapolation)", () => {
    const p: Point = [10, 20];
    const perspective: Point = [20, 40];
    const result = lerpPointToPerspective(p, perspective, 2);

    expect(result).toEqual([30, 60]);
  });

  it("should handle negative interpolation values (extrapolation backwards)", () => {
    const p: Point = [10, 20];
    const perspective: Point = [20, 40];
    const result = lerpPointToPerspective(p, perspective, -0.5);

    expect(result).toEqual([5, 10]);
  });

  it("should handle same point interpolation", () => {
    const p: Point = [15, 25];
    const perspective: Point = [15, 25];
    const result = lerpPointToPerspective(p, perspective, 0.7);

    expect(result).toEqual([15, 25]);
  });

  it("should handle floating point precision correctly", () => {
    const p: Point = [1.1, 2.2];
    const perspective: Point = [3.3, 4.4];
    const result = lerpPointToPerspective(p, perspective, 0.5);

    expect(result[0]).toBeCloseTo(2.2, 10);
    expect(result[1]).toBeCloseTo(3.3, 10);
  });
});
