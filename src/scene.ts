import { polygon } from "./primitives";
import colors from "./styles/colors.module.css";
import type { VirtualCanvasContext } from "./types";

export function drawScene(
  ctx: VirtualCanvasContext,
) {
  // const width = ctx.canvas.width;
  // const height = ctx.canvas.height;

  polygon(ctx, [
    [83, 292],
    [203, 285],
    [236, 312],
    [113, 323],
  ], colors.highlightColor);
}
