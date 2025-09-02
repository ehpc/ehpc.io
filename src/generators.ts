import { MAX_STARS, MAX_WINDOW_BITMASK } from "./constants";
import colors from "./styles/colors.module.css";
import type { Building, BuildingGenerationInterval, GeneratedEntities, Point, ServerBox, Star } from "./types";
import { random, sampleOne } from "./utils";

const INDICATOR_COLORS = [
  colors.skyGradient1,
  colors.skyGradient2,
  colors.skyGradient3,
  colors.skyGradient4,
  colors.skyGradient5,
  colors.transparentColor,
  colors.transparentColor,
  colors.transparentColor,
] as const;

const INDICATOR_MAX_LITUP_TIME = 500;

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

export function generateStars(
  oldStars: Star[],
  maxStars: number,
  deltaTime: number = 0,
): Star[] {
  const stars = oldStars.slice();
  // Advance star glow
  for (const star of stars) {
    star.opacity += (deltaTime / star.glowingSpeed) * 50;
  }
  // Remove old stars
  for (let i = 0; i < stars.length; i++) {
    if (stars[i].opacity >= 100) {
      stars.splice(i, 1);
      i--;
    }
  }
  // Add new stars
  while (stars.length < maxStars) {
    stars.push({
      x: random(133, 370),
      y: random(60, 88),
      color: `hsl(11, 84%, ${random(45, 60)}%)`,
      opacity: deltaTime === 0 ? random(0, 75) : 0,
      glowingSpeed: random(1000, 2000),
    });
  }
  return stars;
}

function createServerBoxWithDisplay(tl: Point, br: Point, depth: number): ServerBox {
  const box: ServerBox = {
    tl,
    br,
    depth,
  };
  // Display
  const paddingTop = 0.15 * (br[1] - tl[1]);
  const paddingLeft = 0.15 * (br[0] - tl[0]);
  box.display = {
    tl: [tl[0] + paddingLeft, tl[1] + paddingTop],
    br: [br[0] - paddingLeft, br[1] - paddingTop],
  };
  return box;
}

function createSmartServerBox(tl: Point, br: Point, depth: number): ServerBox {
  const box: ServerBox = {
    tl,
    br,
    depth,
    indicators: [],
  };
  // Display
  const padding = 0.15 * (br[0] - tl[0]);
  const displaySize = br[0] - tl[0] - 2 * padding - 1;
  box.display = {
    tl: [tl[0] + padding, tl[1] + padding],
    br: [tl[0] + padding + displaySize, tl[1] + padding + displaySize],
  };
  // Indicators
  const freeSpace = br[1] - (tl[1] + 3 * padding + displaySize);
  const indicatorSize = 3;
  const indicatorRowsCount = Math.floor(freeSpace / (2 * indicatorSize));
  const indicatorsCount = Math.ceil(Math.floor(displaySize / indicatorSize) / 2);
  const indicatorsGap = (displaySize - indicatorsCount * indicatorSize) / (indicatorsCount - 1);
  const firstIndicatorPoint = [tl[0] + padding, tl[1] + 2 * padding + displaySize];
  for (let row = 0; row < indicatorRowsCount; row++) {
    for (let i = 0; i < indicatorsCount; i++) {
      box.indicators!.push({
        tl: [
          firstIndicatorPoint[0] + i * (indicatorSize + indicatorsGap),
          firstIndicatorPoint[1] + row * indicatorSize * 2,
        ],
        br: [
          firstIndicatorPoint[0] + i * (indicatorSize + indicatorsGap) + indicatorSize - 1,
          firstIndicatorPoint[1] + row * indicatorSize * 2 + indicatorSize - 1,
        ],
        color: sampleOne(INDICATOR_COLORS),
        litUpTime: 0,
        maxLitUpTime: random(0, INDICATOR_MAX_LITUP_TIME),
      });
    }
  }
  return box;
}

export function generateServerBoxes(oldServerBoxes?: ServerBox[], deltaTime: number = 0): ServerBox[] {
  if (oldServerBoxes) {
    for (const box of oldServerBoxes) {
      if (box.indicators) {
        for (const indicator of box.indicators) {
          indicator.litUpTime += deltaTime;
          if (indicator.litUpTime >= indicator.maxLitUpTime) {
            indicator.litUpTime = 0;
            indicator.maxLitUpTime = random(0, INDICATOR_MAX_LITUP_TIME);
            indicator.color = sampleOne(INDICATOR_COLORS);
          }
        }
      }
    }
    return oldServerBoxes;
  }
  const bigBox = createServerBoxWithDisplay([353, 226], [418, 284], 13);
  const smartBox = createSmartServerBox([357, 148], [397, 223], 6);
  return [bigBox, smartBox];
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
    stars: generateStars([], MAX_STARS),
    serverBoxes: generateServerBoxes(),
  };
}
