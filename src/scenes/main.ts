import type { DrawingCoordinates, GeneratedEntities, VirtualCanvasContext } from "../types";
import { drawCatScene, drawDeskScene, drawRoomScene, drawServerBoxesScene, drawWindowScene } from ".";

export function drawMainScene(
  ctx: VirtualCanvasContext,
  generatedEntities: GeneratedEntities,
  drawingCoordinates: DrawingCoordinates,
) {
  drawWindowScene(ctx, generatedEntities);
  drawRoomScene(ctx);
  drawServerBoxesScene(ctx, generatedEntities, drawingCoordinates);
  drawCatScene(ctx, generatedEntities);
  drawDeskScene(ctx, drawingCoordinates);
}
