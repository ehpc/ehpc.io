import type { VirtualCanvasContext, Rect } from "../types";

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

export function rectRect(ctx: VirtualCanvasContext, r: Rect, fillColor: string) {
  const x0 = r[0][0] | 0;
  const y0 = r[0][1] | 0;
  const x1 = r[2][0] | 0;
  const y1 = r[2][1] | 0;
  rect(ctx, x0, y0, x1, y1, fillColor);
}

/**
 * Gets the height of a rectangle.
 * @param rect The points of the rectangle [TL, TR, BR, BL].
 * @returns The height of the rectangle.
 */
export function getRectHeight(rect: Rect): number {
  const [tl,, br] = rect;
  return Math.abs(br[1] - tl[1]);
}

/**
 * Gets the width of a rectangle.
 * @param rect The points of the rectangle [TL, TR, BR, BL].
 * @returns The width of the rectangle.
 */
export function getRectWidth(rect: Rect): number {
  const [tl,tr] = rect;
  return Math.abs(tr[0] - tl[0]);
}
