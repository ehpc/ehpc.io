import { MAX_STARS } from "../constants";
import colors from "../styles/colors.module.css";
import type { GeneratedEntities } from "../types";
import { generateBuildings } from "./buildings";
import { generateRollingScanlines } from "./rolling-scanlines";
import { generateServerBoxes } from "./server-boxes";
import { generateStars } from "./stars";
import { generateServerBoxTexts } from "./text";

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
    rollingScanlines: generateRollingScanlines(),
    serverBoxTextes: generateServerBoxTexts(),
    cursorPosition: [0, 0],
  };
}
