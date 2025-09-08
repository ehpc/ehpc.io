import type { VirtualCanvasContext } from "../types";

/**
 * Draws a filled oval with scanlines
 */
export function oval(ctx: VirtualCanvasContext, x: number, y: number, r1: number, r2: number, fillColor: string) {
  x |= 0;
  y |= 0;
  r1 |= 0;
  r2 |= 0;
  ctx.fillStyle = fillColor;

  const r1sq = r1 * r1;
  const r2sq = r2 * r2;
  // For each scanline inside the oval, draw a horizontal span
  for (let dy = -r2; dy <= r2; dy++) {
    const dy2 = dy * dy;
    let dx = Math.floor(Math.sqrt((r1sq * (r2sq - dy2)) / r2sq));

    // Prevent 1-pixel appendicies
    if (dx * dx + dy2 === r1sq) dx -= 1;
    if (dx <= 0) continue;

    const yRow = y + dy;
    ctx.fillRect(x - dx, yRow, dx * 2 + 1, 1);
  }
}
