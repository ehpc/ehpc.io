import { MAX_CURSOR_DISTANCE } from "../constants";
import { distanceToRectCenter } from "../primitives";
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
  distortX?: number,
  interval: number = 0,
  elapsed: number = 0,
): RollingScanline {
  return {
    tl,
    boxWidth,
    boxHeight,
    thickness,
    opacity: 0.05,
    currentPosition: 0,
    speed,
    distortX,
    interval,
    elapsed,
  };
}

export function generateRollingScanlines(
  rollingScanlines?: RollingScanline[],
  cursorVirtualPosition?: Point,
  deltaTime: number = 0,
): RollingScanline[] {
  if (!rollingScanlines) {
    const bottomBoxScanline = createScanline([362, 235], 46, 42, 3, 200);
    const bottomBoxDistortionScanline = createScanline([362, 235], 46, 42, 3, 50, 3, 1000);
    const topBoxScanline = createScanline([363, 153], 27, 30, 2, 150);
    const topBoxDistortionScanline = createScanline([363, 153], 27, 30, 1, 30, 2, 900);
    const slimBoxScanline = createScanline([308, 215], 33, 16, 1, 100);
    const slimBoxDistortionScanline = createScanline([308, 215], 33, 16, 1, 20, 2, 800);
    return [
      bottomBoxScanline,
      topBoxScanline,
      bottomBoxDistortionScanline,
      topBoxDistortionScanline,
      slimBoxScanline,
      slimBoxDistortionScanline,
    ];
  }

  for (const scanline of rollingScanlines) {
    scanline.elapsed += deltaTime;
    if (scanline.interval && scanline.elapsed < scanline.interval) {
      continue;
    }
    scanline.currentPosition += (scanline.speed * deltaTime) / 1000;
    if (scanline.currentPosition > scanline.boxHeight - scanline.thickness - 1) {
      scanline.currentPosition = random(0, scanline.thickness);
      scanline.elapsed = 0;
    }

    if (cursorVirtualPosition) {
      // Adjust opacity based on distance to cursor
      const distanceToCursor = Math.min(
        distanceToRectCenter(cursorVirtualPosition, [scanline.tl, [
          scanline.tl[0] + scanline.boxWidth,
          scanline.tl[1] + scanline.boxHeight,
        ]]),
        MAX_CURSOR_DISTANCE,
      );
      scanline.opacity = 0.05 + (MAX_CURSOR_DISTANCE - distanceToCursor) / MAX_CURSOR_DISTANCE * 0.15;
    }
  }

  return rollingScanlines;
}
