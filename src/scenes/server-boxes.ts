import { cube1, rect } from "../primitives";
import colors from "../styles/colors.module.css";
import type { GeneratedEntities, Point, VirtualCanvasContext } from "../types";

export function drawServerBoxesScene(ctx: VirtualCanvasContext, generatedEntities: GeneratedEntities) {
  const perspectivePoint: Point = [254, 127];
  const { serverBoxes } = generatedEntities;
  for (const box of serverBoxes) {
    const { tl, br, depth, display, indicators } = box;
    cube1(ctx, tl, br, perspectivePoint, depth, colors.boxFrontColor, colors.boxSideColor, colors.boxTopColor);
    if (display) {
      rect(ctx, ...display.tl, ...display.br, colors.displayGlassColor);
    }
    if (indicators) {
      for (const indicator of indicators) {
        rect(ctx, ...indicator.tl, ...indicator.br, indicator.color);
      }
    }
  }
}
