import type { GeneratedEntities, VirtualCanvasContext } from "../types";
import { drawCrtEffect, drawDeskScene, drawRoomScene, drawServerBoxesScene, drawTextScene, drawWindowScene } from ".";

export function drawMainScene(
  ctx: VirtualCanvasContext,
  generatedEntities: GeneratedEntities,
  offsetX: number,
) {
  drawWindowScene(ctx, generatedEntities);
  drawRoomScene(ctx);
  drawServerBoxesScene(ctx, generatedEntities, offsetX);
  drawDeskScene(ctx, offsetX);
  drawTextScene(ctx, generatedEntities, offsetX);
}
