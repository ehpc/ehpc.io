import type { VirtualCanvasContext } from "../types";

export function rect(
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
  const w = right - left + 1;
  const h = bottom - top + 1;

  ctx.fillStyle = fillColor;
  ctx.fillRect(left, top, w, h);
}
