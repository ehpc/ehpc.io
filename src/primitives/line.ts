import type { VirtualCanvasContext } from "../types";

export function line(ctx: VirtualCanvasContext, x0: number, y0: number, x1: number, y1: number, color: string) {
  x0 |= 0;
  y0 |= 0;
  x1 |= 0;
  y1 |= 0;
  ctx.fillStyle = color;

  // Bresenham's line algorithm
  let dx = Math.abs(x1 - x0);
  let dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;

  while (true) {
    ctx.fillRect(x0, y0, 1, 1);
    if (x0 === x1 && y0 === y1) break;

    const e2 = err << 1;
    if (e2 > -dy) {
      err -= dy;
      x0 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y0 += sy;
    }
  }
}
