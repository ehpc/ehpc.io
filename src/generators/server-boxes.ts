import colors from "../styles/colors.module.css";
import type { Point, ServerBox } from "../types";
import { random, sampleOne } from "../utils";

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
const INDICATOR_SIZE = 3;
const SERVER_BOX_DISPLAY_PADDING_FACTOR = 0.15;
const SERVER_BOX_DISPLAY_MIN_PADDING = 5;

function createServerBoxWithDisplay(tl: Point, br: Point, depth: number): ServerBox {
  const box: ServerBox = {
    tl,
    br,
    depth,
  };
  // Display
  const paddingTop = Math.max(SERVER_BOX_DISPLAY_MIN_PADDING, SERVER_BOX_DISPLAY_PADDING_FACTOR * (br[1] - tl[1]));
  const paddingLeft = Math.max(SERVER_BOX_DISPLAY_MIN_PADDING, SERVER_BOX_DISPLAY_PADDING_FACTOR * (br[0] - tl[0]));
  box.display = {
    tl: [tl[0] + paddingLeft, tl[1] + paddingTop],
    br: [br[0] - paddingLeft, br[1] - paddingTop],
  };
  return box;
}

function createSmartServerBox(
  tl: Point,
  br: Point,
  depth: number,
  indicatorSize: number = INDICATOR_SIZE,
  rowGap: number = indicatorSize,
): ServerBox {
  const box: ServerBox = {
    tl,
    br,
    depth,
    indicators: [],
  };
  // Display
  const hasDisplay = br[1] - tl[1] > (br[0] - tl[0]) * 1.5;
  let padding = Math.max(INDICATOR_SIZE, indicatorSize);
  let displaySize = br[0] - tl[0] - 2 * padding;
  if (hasDisplay) {
    padding = Math.max(SERVER_BOX_DISPLAY_MIN_PADDING, SERVER_BOX_DISPLAY_PADDING_FACTOR * (br[0] - tl[0]));
    displaySize = br[0] - tl[0] - 2 * padding - 1;
    box.display = {
      tl: [tl[0] + padding, tl[1] + padding],
      br: [tl[0] + padding + displaySize, tl[1] + padding + displaySize],
    };
  }
  // Indicators
  const freeSpace = hasDisplay ? br[1] - (tl[1] + 3 * padding + displaySize) : br[1] - tl[1] - 2 * padding;
  const indicatorRowsCount = Math.floor(freeSpace / (2 * indicatorSize));
  const indicatorsCount = Math.ceil(Math.floor(displaySize / indicatorSize) / 2);
  const indicatorsGap = (displaySize - indicatorsCount * indicatorSize) / (indicatorsCount - 1);
  const firstIndicatorPoint = [tl[0] + padding, tl[1] + (hasDisplay ? 2 * padding + displaySize : padding)];
  for (let row = 0; row < indicatorRowsCount; row++) {
    for (let i = 0; i < indicatorsCount; i++) {
      box.indicators!.push({
        tl: [
          firstIndicatorPoint[0] + i * (indicatorSize + indicatorsGap),
          firstIndicatorPoint[1] + row * (indicatorSize + rowGap),
        ],
        br: [
          firstIndicatorPoint[0] + i * (indicatorSize + indicatorsGap) + indicatorSize - 1,
          firstIndicatorPoint[1] + row * (indicatorSize + rowGap) + indicatorSize - 1,
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
  const smallBox = createServerBoxWithDisplay([306, 252], [335, 281], 9);
  const smallSmartBox = createSmartServerBox([313, 234], [340, 248], 5, 2, 3);
  return [bigBox, smartBox, smallBox, smallSmartBox];
}
