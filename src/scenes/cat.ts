import { oval, polygon, rect, thickLine } from "../primitives";
import colors from "../styles/colors.module.css";
import type { GeneratedEntities, Point, VirtualCanvasContext } from "../types";

export function drawCatScene(
  ctx: VirtualCanvasContext,
  generatedEntities: GeneratedEntities,
) {
  ctx.translate(240, 160);

  // Head
  rect(ctx, 17, 5, 33, 15, colors.catColor);
  // Ears
  polygon(ctx, [[17, 5], [17, 1], [20, 5]], colors.catColor);
  polygon(ctx, [[34, 5], [34, 1], [31, 5]], colors.catColor);
  // Cheeks
  rect(ctx, 15, 11, 35, 15, colors.catColor);
  // Body top
  polygon(ctx, [[24, 16], [35, 16], [30, 19], [36, 31], [24, 31]], colors.catColor);
  polygon(ctx, [[27, 16], [16, 16], [21, 19], [15, 31], [27, 31]], colors.catColor);
  // Body bottom
  rect(ctx, 15, 31, 35, 38, colors.catColor);
  oval(ctx, 25, 37, 11, 5, colors.catColor);
  // Tail
  const fulcrum: Point = [25, 42];
  const tailPoints: Point[] = generatedEntities.catTail.points;
  let prevPoint = fulcrum;
  for (const tailPoint of tailPoints) {
    thickLine(
      ctx,
      prevPoint[0],
      prevPoint[1],
      prevPoint[0] + tailPoint[0],
      prevPoint[1] + tailPoint[1],
      3,
      colors.catColor,
    );
    prevPoint = [prevPoint[0] + tailPoint[0], prevPoint[1] + tailPoint[1]];
  }

  ctx.setTransform(1, 0, 0, 1, 0, 0);
}
