import type { GeneratedEntities, VirtualCanvasContext } from "../types";
import { drawWindowScene, drawRoomScene } from ".";

export function drawMainScene(
  ctx: VirtualCanvasContext,
  generatedEntities: GeneratedEntities,
) {
  // const width = ctx.canvas.width;
  // const height = ctx.canvas.height;

  drawWindowScene(ctx, generatedEntities);
  drawRoomScene(ctx);

  // Draw table
  // Draw PC box
  // Draw monitor
  // Draw keyboard
}
