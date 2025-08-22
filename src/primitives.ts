import type { VirtualCanvasContext } from "./types";

export function pixel(ctx: VirtualCanvasContext, x: number, y: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(x | 0, y | 0, 1, 1);
}

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

export function rect(
  ctx: VirtualCanvasContext,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  fillColor?: string,
  borderColor?: string,
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

  if (fillColor) {
    ctx.fillStyle = fillColor;
    ctx.fillRect(left, top, w, h);
  }

  // Draw border last so it sits on top
  if (borderColor) {
    line(ctx, left, top, right, top, borderColor); // top
    line(ctx, left, bottom, right, bottom, borderColor); // bottom
    line(ctx, left, top, left, bottom, borderColor); // left
    line(ctx, right, top, right, bottom, borderColor); // right
  }
}

/**
 * Scanline polygon fill
 */
export function polygon(
  ctx: VirtualCanvasContext,
  points: [number, number][],
  fillColor: string,
) {
  if (points.length < 3) return;

  // Precompute vertical bounds
  let minY = Infinity;
  let maxY = -Infinity;
  for (const [, y] of points) {
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  if (!isFinite(minY) || !isFinite(maxY)) return;

  // Scan integer rows whose centers (y+0.5) cross the polygon interior
  const yStart = Math.ceil(minY - 0.5);
  const yEnd = Math.floor(maxY - 0.5);

  ctx.fillStyle = fillColor;

  const n = points.length;
  // For each scanline
  for (let y = yStart; y <= yEnd; y++) {
    const yScan = y + 0.5; // sample at pixel center
    const xs: number[] = [];

    // Collect edge intersections with this scanline
    for (let i = 0; i < n; i++) {
      let [x0, y0] = points[i];
      let [x1, y1] = points[(i + 1) % n];

      // Skip horizontal edges to avoid double counting
      if (y0 === y1) continue;

      // Ensure y0 < y1 for a consistent half-open interval [y0, y1)
      if (y0 > y1) {
        [x0, x1] = [x1, x0];
        [y0, y1] = [y1, y0];
      }

      // Include edge if yScan is within [y0, y1)
      if (yScan >= y0 && yScan < y1) {
        const t = (yScan - y0) / (y1 - y0);
        const xi = x0 + t * (x1 - x0);
        xs.push(xi);
      }
    }

    if (xs.length < 2) continue;

    xs.sort((a, b) => a - b);

    // Fill spans between pairs of intersections
    for (let i = 0; i + 1 < xs.length; i += 2) {
      const xa = xs[i];
      const xb = xs[i + 1];

      // Convert continuous span to integer pixel columns by center sampling:
      // fill x where (x+0.5) in [xa, xb]  => x in [ceil(xa - 0.5), floor(xb - 0.5)]
      const xStart = Math.ceil(Math.min(xa, xb) - 0.5);
      const xEnd = Math.floor(Math.max(xa, xb) - 0.5);

      if (xEnd >= xStart) {
        ctx.fillRect(xStart, y, xEnd - xStart + 1, 1);
      }
    }
  }
}
