import { afterEach, beforeEach, describe, expect, it, mock, spyOn } from "bun:test";
import type { Mock } from "bun:test";
import { MAX_WINDOW_BITMASK } from "../constants";
import type { BuildingGenerationInterval } from "../types";
import { generateBuildings } from ".";

describe("generators", () => {
  describe("generateBuildings", () => {
    let spiedRandom: Mock<typeof Math.random>;

    beforeEach(() => {
      // Mock Math.random to make tests deterministic
      spiedRandom = spyOn(Math, "random");
    });

    afterEach(() => {
      mock.restore();
    });

    it("should generate buildings within the specified intervals", () => {
      const intervals: BuildingGenerationInterval[] = [
        { x0: 0, x1: 100, minWidth: 10, maxWidth: 20, minY: 50, maxY: 100 },
      ];
      const color = "red";

      const buildings = generateBuildings(undefined, intervals, color);

      expect(buildings.length).toBeGreaterThan(0);
      buildings.forEach(building => {
        expect(building.x).toBeGreaterThanOrEqual(0);
        expect(building.x).toBeLessThan(100);
        expect(building.width).toBeGreaterThanOrEqual(10);
        expect(building.width).toBeLessThanOrEqual(20);
        expect(building.y).toBeGreaterThanOrEqual(50);
        expect(building.y).toBeLessThanOrEqual(100);
        expect(building.color).toBe(color);
      });
    });

    it("should generate buildings that span the entire interval", () => {
      const intervals: BuildingGenerationInterval[] = [
        { x0: 0, x1: 50, minWidth: 10, maxWidth: 10, minY: 50, maxY: 50 },
      ];
      const color = "blue";

      const buildings = generateBuildings(undefined, intervals, color);

      // Calculate total width of all buildings
      const totalWidth = buildings.reduce((sum, building) => sum + building.width, 0);
      expect(totalWidth).toBeGreaterThanOrEqual(50);
    });

    it("should respect width constraints", () => {
      spiedRandom.mockReturnValue(0.5); // Deterministic random

      const intervals: BuildingGenerationInterval[] = [
        { x0: 0, x1: 100, minWidth: 15, maxWidth: 25, minY: 50, maxY: 100 },
      ];
      const color = "green";

      const buildings = generateBuildings(undefined, intervals, color);

      buildings.forEach(building => {
        expect(building.width).toBeGreaterThanOrEqual(15);
        expect(building.width).toBeLessThanOrEqual(25);
      });
    });

    it("should respect height constraints", () => {
      spiedRandom.mockReturnValue(0.5); // Deterministic random

      const intervals: BuildingGenerationInterval[] = [
        { x0: 0, x1: 100, minWidth: 10, maxWidth: 20, minY: 80, maxY: 120 },
      ];
      const color = "purple";

      const buildings = generateBuildings(undefined, intervals, color);

      buildings.forEach(building => {
        expect(building.y).toBeGreaterThanOrEqual(80);
        expect(building.y).toBeLessThanOrEqual(120);
      });
    });

    it("should handle multiple intervals correctly", () => {
      const intervals: BuildingGenerationInterval[] = [
        { x0: 0, x1: 50, minWidth: 10, maxWidth: 15, minY: 50, maxY: 80 },
        { x0: 50, x1: 100, minWidth: 20, maxWidth: 25, minY: 60, maxY: 90 },
      ];
      const color = "orange";

      const buildings = generateBuildings(undefined, intervals, color);

      // Check that we have buildings in both intervals
      const buildingsInFirstInterval = buildings.filter(b => b.x < 50);
      const buildingsInSecondInterval = buildings.filter(b => b.x >= 50);

      expect(buildingsInFirstInterval.length).toBeGreaterThan(0);
      expect(buildingsInSecondInterval.length).toBeGreaterThan(0);

      // Check width constraints for each interval
      buildingsInFirstInterval.forEach(building => {
        expect(building.width).toBeGreaterThanOrEqual(10);
        expect(building.width).toBeLessThanOrEqual(15);
      });

      buildingsInSecondInterval.forEach(building => {
        expect(building.width).toBeGreaterThanOrEqual(20);
        expect(building.width).toBeLessThanOrEqual(25);
      });
    });

    it("should generate windows bitmask for wide buildings", () => {
      spiedRandom.mockReturnValue(0.5); // Ensures 0.8 check passes and generates windows

      const intervals: BuildingGenerationInterval[] = [
        { x0: 0, x1: 100, minWidth: 15, maxWidth: 15, minY: 50, maxY: 50 }, // Wide buildings
      ];
      const color = "cyan";

      const buildings = generateBuildings(undefined, intervals, color);

      buildings.forEach(building => {
        expect(building.options.windowsBitmask).toBeGreaterThan(0);
        expect(building.options.windowsBitmask).toBeLessThanOrEqual(MAX_WINDOW_BITMASK);
      });
    });

    it("should not generate windows for narrow buildings", () => {
      spiedRandom.mockReturnValue(0.5);

      const intervals: BuildingGenerationInterval[] = [
        { x0: 0, x1: 300, minWidth: 5, maxWidth: 5, minY: 50, maxY: 50 }, // Narrow buildings
      ];
      const color = "magenta";

      const buildings = generateBuildings(undefined, intervals, color);

      buildings.forEach(building => {
        expect(building.options.windowsBitmask).toBe(0);
      });
    });

    it("should generate consistent building structures", () => {
      const intervals: BuildingGenerationInterval[] = [
        {
          x0: 0,
          x1: 50,
          minWidth: 10,
          maxWidth: 10,
          minY: 50,
          maxY: 50,
        },
      ];
      const color = "yellow";

      const buildings = generateBuildings(undefined, intervals, color);

      // Test basic structure regardless of option handling bugs
      buildings.forEach(building => {
        expect(building).toHaveProperty("x");
        expect(building).toHaveProperty("y");
        expect(building).toHaveProperty("width");
        expect(building).toHaveProperty("color");
        expect(building).toHaveProperty("options");
        expect(building.options).toHaveProperty("windowsBitmask");
        expect(building.options).toHaveProperty("antennaLength");
        expect(typeof building.options.windowsBitmask).toBe("number");
        expect(typeof building.options.antennaLength).toBe("number");
        expect(building.color).toBe("yellow");
      });
    });

    it("should handle zero values in forced options correctly", () => {
      const intervals: BuildingGenerationInterval[] = [
        {
          x0: 0,
          x1: 30,
          minWidth: 15,
          maxWidth: 15,
          minY: 50,
          maxY: 50,
          options: { windowsBitmask: 0, antennaLength: 0 }, // Explicit zero values
        },
      ];
      const color = "blue";

      const buildings = generateBuildings(undefined, intervals, color);

      buildings.forEach(building => {
        expect(building.options.antennaLength).toBe(0);
        expect(building.options.windowsBitmask).toBe(0);
      });
    });

    it("should generate antennas based on height difference and probability", () => {
      // Create a scenario that should generate antennas
      // We need to carefully mock the sequence of Math.random() calls
      const mockValues = [
        // First building:
        0.5, // buildingWidth calculation (width = 12)
        0.9, // buildingY calculation (high Y = 45 + 50 = 95)
        0.5, // windows check (< 0.8, so windows generated since width >= 10)
        0.5, // windows bitmask generation (via random())

        // Second building:
        0.5, // buildingWidth calculation (width = 12)
        0.1, // buildingY calculation (low Y = 5 + 50 = 55, creates height diff)
        0.5, // windows check
        0.5, // windows bitmask generation
        0.05, // antenna probability check (buildingY < prevY, antennasGap = 1, so 0.05 < 1 * 0.1)
        0.5, // antenna length generation (3 + 7 = 10)
      ];
      let callCount = 0;
      spiedRandom.mockImplementation(() => {
        const value = mockValues[callCount % mockValues.length];
        callCount++;
        return value;
      });

      const intervals: BuildingGenerationInterval[] = [
        { x0: 0, x1: 300, minWidth: 10, maxWidth: 15, minY: 50, maxY: 100 }, // Wide enough for windows
      ];
      const color = "red";

      const buildings = generateBuildings(undefined, intervals, color);

      // With our carefully mocked sequence, the second building should have an antenna
      // because: buildingY(55) < prevY(95) and Math.random()(0.05) < antennasGap(1) * 0.1
      expect(buildings.some(building => (building.options.antennaLength ?? 0) >= 7)).toBe(true);
    });

    it("should handle empty intervals gracefully", () => {
      expect(generateBuildings(undefined, [], "black")).toEqual([]);
    });

    it("should handle single interval correctly", () => {
      const intervals: BuildingGenerationInterval[] = [
        { x0: 10, x1: 30, minWidth: 5, maxWidth: 5, minY: 40, maxY: 40 },
      ];
      const color = "white";

      const buildings = generateBuildings(undefined, intervals, color);

      expect(buildings.length).toBeGreaterThan(0);
      expect(buildings[0].x).toBe(10);
      expect(buildings[0].y).toBe(40);
      expect(buildings[0].width).toBe(5);
      expect(buildings[0].color).toBe("white");
    });

    it("should handle minimum viable interval", () => {
      const intervals: BuildingGenerationInterval[] = [
        { x0: 0, x1: 1, minWidth: 1, maxWidth: 1, minY: 0, maxY: 0 },
      ];
      const color = "black";

      const buildings = generateBuildings(undefined, intervals, color);

      expect(buildings.length).toBeGreaterThan(0);
      buildings.forEach(building => {
        expect(building.width).toBe(1);
        expect(building.y).toBe(0);
        expect(building.color).toBe("black");
      });
    });
  });
});
