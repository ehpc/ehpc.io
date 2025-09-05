import type { Point, RollingScanline } from "../types";
import { random } from "../utils";

/**
 * Creates a rolling scanline.
 * @param tl - The top-left corner of the scanline.
 * @param boxWidth - The width of the scanline box.
 * @param boxHeight - The height of the scanline box.
 * @param thickness - The thickness of the scanline.
 * @param speed - The speed at which the scanline moves (pixels per second).
 * @returns The created rolling scanline.
 */
function createScanline(
  tl: Point,
  boxWidth: number,
  boxHeight: number,
  thickness: number,
  speed: number,
): RollingScanline {
  return {
    tl,
    boxWidth,
    boxHeight,
    thickness,
    currentPosition: 0,
    speed,
  };
}

export function generateRollingScanlines(
  rollingScanlines?: RollingScanline[],
  deltaTime: number = 0,
): RollingScanline[] {
  if (!rollingScanlines) {
    const bottomBoxScanline = createScanline([362, 235], 46, 42, 3, 200);
    const topBoxScanline = createScanline([363, 153], 27, 30, 2, 150);
    return [bottomBoxScanline, topBoxScanline];
  }

  for (const scanline of rollingScanlines) {
    scanline.currentPosition += (scanline.speed * deltaTime) / 1000;
    if (scanline.currentPosition > scanline.boxHeight - scanline.thickness - 1) {
      scanline.currentPosition = random(0, scanline.thickness);
    }
  }

  return rollingScanlines;
}
