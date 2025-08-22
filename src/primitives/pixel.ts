import type { VirtualCanvasContext } from "../types";

export function pixel(ctx: VirtualCanvasContext, x: number, y: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(x | 0, y | 0, 1, 1);
}
