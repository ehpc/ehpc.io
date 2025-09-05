import { DESK_OFFSET_X_THRESHOLD, SERVER_BOXES_OFFSET_X_THRESHOLD } from "../constants";
import { rect } from "../primitives/";
import colors from "../styles/colors.module.css";
import type { GeneratedEntities, VirtualCanvasContext } from "../types";

function drawPCText(ctx: VirtualCanvasContext, offsetX: number) {
  const pcOffset = Math.max(0, offsetX - DESK_OFFSET_X_THRESHOLD);
  ctx.translate(pcOffset, 0);

  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

export function drawTextScene(ctx: VirtualCanvasContext, generatedEntities: GeneratedEntities, offsetX: number) {
  ctx.fillStyle = colors.textColor;
  drawPCText(ctx, offsetX);
}
