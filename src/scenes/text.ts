import { DESK_OFFSET_X_THRESHOLD } from "../constants";
import colors from "../styles/colors.module.css";
import type { DrawingCoordinates, GeneratedEntities, VirtualCanvasContext } from "../types";

function drawPCText(ctx: VirtualCanvasContext, drawingCoordinates: DrawingCoordinates) {
  const pcOffset = Math.max(0, drawingCoordinates.virtualX - DESK_OFFSET_X_THRESHOLD);
  ctx.translate(pcOffset, 0);

  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

export function drawTextScene(
  ctx: VirtualCanvasContext,
  generatedEntities: GeneratedEntities,
  drawingCoordinates: DrawingCoordinates,
) {
  generatedEntities = generatedEntities;
  ctx.fillStyle = colors.textColor;
  drawPCText(ctx, drawingCoordinates);
}
