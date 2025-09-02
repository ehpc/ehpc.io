import type { VirtualCanvasContext } from "../types";

/**
 * Draws a debug point on the canvas
 * @param ctx The canvas context to draw on
 * @param x The x-coordinate of the point
 * @param y The y-coordinate of the point
 * @param variant The variant of the debug point color
 */
export function debugPoint(ctx: VirtualCanvasContext, x: number, y: number, variant: number = 0) {
  ctx.fillStyle = variant ? `hsl(128, 100%, ${variant}%)` : "hsl(128, 100%, 50%)";
  // Draw circle
  ctx.beginPath();
  ctx.arc(x, y, 2, 0, Math.PI * 2);
  ctx.fill();
}
