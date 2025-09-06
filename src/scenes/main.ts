import type { DrawingCoordinates, GeneratedEntities, VirtualCanvasContext } from "../types";
import { drawDeskScene, drawRoomScene, drawServerBoxesScene, drawTextScene, drawWindowScene } from ".";

export function drawMainScene(
  ctx: VirtualCanvasContext,
  generatedEntities: GeneratedEntities,
  drawingCoordinates: DrawingCoordinates,
) {
  drawWindowScene(ctx, generatedEntities);
  drawRoomScene(ctx);
  drawServerBoxesScene(ctx, generatedEntities, drawingCoordinates);
  drawDeskScene(ctx, generatedEntities, drawingCoordinates);
  drawTextScene(ctx, generatedEntities, drawingCoordinates);
}
