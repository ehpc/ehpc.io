import { MAX_WINDOW_BITMASK } from "../constants";
import type { Building, BuildingGenerationInterval } from "../types";
import { random } from "../utils";

export function generateBuildings(
  intervals: BuildingGenerationInterval[],
  color: string,
): Building[] {
  if (!intervals.length) return [];
  const generatedBuildings: Building[] = [];
  // Pregenerate buildings to make them stable between frames
  const maxX = intervals[intervals.length - 1].x1;
  const minimalYDiff = 10;
  let x = intervals[0].x0;
  let prevY = 0;
  let currentInterval = 0;
  let buildingCount = 0;
  let lastBuildingWithAntenna = 0;
  while (x < maxX) {
    const { minWidth, maxWidth, minY, maxY, options } = intervals[currentInterval];
    const buildingWidth = Math.floor(Math.random() * (maxWidth - minWidth + 1)) + minWidth;
    let buildingY = 0;
    let tries = 10;
    do {
      // Ensure the building's height is substantially different from the previous one
      buildingY = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
      tries -= 1;
      // "9 - tries" forces to accept lower differences over time
    } while (tries > 0 && Math.abs(buildingY - prevY) < (minimalYDiff - (9 - tries)));
    const windowsBitmask = options?.windowsBitmask ?? (buildingWidth >= 10 && Math.random() < 0.8)
      ? random(1, MAX_WINDOW_BITMASK)
      : 0;
    const antennasGap = buildingCount - lastBuildingWithAntenna;
    // Draw antenna with probability depending on the last saw antenna
    const antennaLength = options?.antennaLength ?? (buildingY < prevY && Math.random() < antennasGap * 0.1)
      ? Math.floor(Math.random() * 6) + 7
      : 0;
    if (antennaLength) {
      lastBuildingWithAntenna = buildingCount;
    }
    generatedBuildings.push({
      x,
      y: buildingY,
      width: buildingWidth,
      color,
      options: {
        windowsBitmask,
        antennaLength,
      },
    });
    prevY = buildingY;
    x += buildingWidth;
    if (x >= intervals[currentInterval].x1) {
      currentInterval += 1;
    }
    buildingCount += 1;
  }
  return generatedBuildings;
}
