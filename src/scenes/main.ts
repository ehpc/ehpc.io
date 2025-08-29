import type { GeneratedEntities, VirtualCanvasContext } from "../types";
import { drawDeskScene, drawRoomScene, drawWindowScene } from ".";

export function drawMainScene(
  ctx: VirtualCanvasContext,
  generatedEntities: GeneratedEntities,
) {
  // const width = ctx.canvas.width;
  // const height = ctx.canvas.height;

  drawWindowScene(ctx, generatedEntities);
  drawRoomScene(ctx);
  drawDeskScene(ctx);
}
