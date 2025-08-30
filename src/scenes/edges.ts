import { rect } from "../primitives";
import colors from "../styles/colors.module.css";
import type { VirtualCanvasContext } from "../types";

export function drawEdges(ctx: VirtualCanvasContext, x: number, y: number) {
  if (x > 0) {
    rect(ctx, 0, 0, x, ctx.canvas.height, colors.wallLeftColor);
    rect(ctx, ctx.canvas.width - x, 0, ctx.canvas.width, ctx.canvas.height, colors.wallRightColor);
  }
  if (y > 0) {
    rect(ctx, 0, 0, ctx.canvas.width, y, colors.ceilingColor);
  }
}
