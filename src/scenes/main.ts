import type { GeneratedEntities, VirtualCanvasContext } from "../types";
import { drawDeskScene, drawRoomScene, drawServerBoxesScene, drawWindowScene } from ".";

export function drawMainScene(
  ctx: VirtualCanvasContext,
  generatedEntities: GeneratedEntities,
) {
  // const width = ctx.canvas.width;
  // const height = ctx.canvas.height;

  drawWindowScene(ctx, generatedEntities);
  drawRoomScene(ctx);
  drawServerBoxesScene(ctx, generatedEntities);
  drawDeskScene(ctx);
}
