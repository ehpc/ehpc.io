import type { VirtualCanvasContext } from "../types";

/**
 * Draws a filled circle with scanlines
 */
export function circle(ctx: VirtualCanvasContext, x: number, y: number, radius: number, fillColor: string) {
  x |= 0;
  y |= 0;
  radius |= 0;
  ctx.fillStyle = fillColor;

  const r2 = radius * radius;
  // For each scanline inside the circle, draw a horizontal span
  for (let dy = -radius; dy <= radius; dy++) {
    const dy2 = dy * dy;
    let dx = Math.floor(Math.sqrt(r2 - dy2));

    // Prevent 1-pixel appendicies
    if (dx * dx + dy2 === r2) dx -= 1;
    if (dx < 0) continue;

    const yRow = y + dy;
    ctx.fillRect(x - dx, yRow, dx * 2 + 1, 1);
  }
}
