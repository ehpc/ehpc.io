import { MAX_WINDOW_BITMASK } from "./constants";
import colors from "./styles/colors.module.css";
import type { Building, BuildingGenerationInterval, GeneratedEntities } from "./types";
import { random } from "./utils";

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

export function generateAllEntities(): GeneratedEntities {
  const backgroundBuildings = generateBuildings([
    { x0: 90, x1: 190, minWidth: 7, maxWidth: 10, minY: 135, maxY: 160 },
    { x0: 190, x1: 268, minWidth: 7, maxWidth: 10, minY: 154, maxY: 178 },
    { x0: 268, x1: 416, minWidth: 10, maxWidth: 18, minY: 120, maxY: 164 },
  ], colors.backgroundBuildingColor);
  const foregroundBuildings = generateBuildings([
    { x0: 90, x1: 174, minWidth: 9, maxWidth: 17, minY: 114, maxY: 145 },
    {
      x0: 174,
      x1: 264,
      minWidth: 10,
      maxWidth: 20,
      minY: 173,
      maxY: 186,
      options: { antennaLength: 0, windowsBitmask: 0 },
    },
    { x0: 264, x1: 340, minWidth: 8, maxWidth: 17, minY: 155, maxY: 175 },
    { x0: 340, x1: 416, minWidth: 12, maxWidth: 22, minY: 98, maxY: 148 },
  ], colors.foregroundBuildingColor);
  return {
    backgroundBuildings,
    foregroundBuildings,
  };
}
