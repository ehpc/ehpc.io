import type { VirtualCanvasContext } from "../types";

/**
 * This rect is filled from the outside
 */
export function reverseRect(
  ctx: VirtualCanvasContext,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  fillColor: string,
) {
  x0 |= 0;
  y0 |= 0;
  x1 |= 0;
  y1 |= 0;

  const left = Math.min(x0, x1);
  const right = Math.max(x0, x1);
  const top = Math.min(y0, y1);
  const bottom = Math.max(y0, y1);

  // Canvas bounds
  const canvasWidth = ctx.canvas.width;
  const canvasHeight = ctx.canvas.height;

  ctx.fillStyle = fillColor;

  // Top strip
  ctx.fillRect(0, 0, canvasWidth, top);

  // Bottom strip
  ctx.fillRect(0, bottom, canvasWidth, canvasHeight - bottom);

  // Left strip
  ctx.fillRect(0, top, left, bottom - top);

  // Right strip
  ctx.fillRect(right, top, canvasWidth - right, bottom - top);
}
