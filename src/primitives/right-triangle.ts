import type { VirtualCanvasContext } from "../types";

type TriangleOrientation = "NW" | "NE" | "SW" | "SE";

/**
 * Draws a right triangle via scanlines
 */
export function rightTriangle(
  ctx: VirtualCanvasContext,
  x: number,
  y: number,
  width: number,
  height: number,
  fillColor: string,
  orientation: TriangleOrientation,
) {
  ctx.fillStyle = fillColor;
  if (orientation === "NW") {
    for (let i = 0; i < height; i++) {
      ctx.fillRect(x, y + i, width - Math.round((width * i) / height), 1);
    }
  } else if (orientation === "NE") {
    for (let i = 0; i < height; i++) {
      ctx.fillRect(x - Math.round((width * (height - i)) / height), y + i, width - Math.round((width * i) / height), 1);
    }
  } else if (orientation === "SW") {
    for (let i = 0; i < height; i++) {
      ctx.fillRect(x, y - i - 1, width - Math.round((width * i) / height), 1);
    }
  } else if (orientation === "SE") {
    for (let i = 0; i < height; i++) {
      ctx.fillRect(
        x - Math.round((width * (height - i)) / height),
        y - i - 1,
        width - Math.round((width * i) / height),
        1,
      );
    }
  }
}
