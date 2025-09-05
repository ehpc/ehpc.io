import { rect } from "../primitives";
import colors from "../styles/colors.module.css";

export function drawEdges(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const { width, height } = ctx.canvas.getBoundingClientRect();
  if (x > 0) {
    rect(ctx, 0, 0, x, height, colors.wallLeftColor);
    rect(ctx, width - x, 0, width, height, colors.wallRightColor);
  }
  if (y > 0) {
    rect(ctx, 0, 0, width, y, colors.ceilingColor);
  }
}
