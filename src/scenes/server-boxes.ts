import { SERVER_BOXES_OFFSET_X_THRESHOLD } from "../constants";
import { cube1, rect } from "../primitives";
import colors from "../styles/colors.module.css";
import type { GeneratedEntities, Point, VirtualCanvasContext } from "../types";

function drawScanlines(ctx: VirtualCanvasContext, generatedEntities: GeneratedEntities) {
  for (
    const { tl, boxWidth, thickness, currentPosition, elapsed, interval, distortX } of generatedEntities
      .rollingScanlines
  ) {
    if (interval && elapsed < interval) {
      continue;
    }
    if (distortX) {
      // Shift pixels under scanline
      for (let y = 0; y < thickness; y++) {
        ctx.drawImage(
          ctx.canvas,
          tl[0],
          tl[1] + currentPosition + y,
          boxWidth,
          1,
          tl[0] + distortX,
          tl[1] + currentPosition + y,
          boxWidth - distortX,
          1,
        );
      }
    }
    rect(
      ctx,
      tl[0],
      tl[1] + currentPosition,
      tl[0] + boxWidth,
      tl[1] + currentPosition + thickness,
      colors.scanlineColor,
    );
  }
}

function drawServerBoxesText(ctx: VirtualCanvasContext, generatedEntities: GeneratedEntities) {
  ctx.fillStyle = colors.textColor;
  for (const { text, x, y, size, shift } of generatedEntities.serverBoxTextes) {
    ctx.font = `${size}px NES`;
    ctx.fillText(text, x + (shift?.currentShift || 0), y);
  }
}

export function drawServerBoxesScene(ctx: VirtualCanvasContext, generatedEntities: GeneratedEntities, offsetX: number) {
  const serverBoxesOffset = -Math.max(0, offsetX - SERVER_BOXES_OFFSET_X_THRESHOLD);
  ctx.translate(serverBoxesOffset, 0);

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

  drawServerBoxesText(ctx, generatedEntities);
  drawScanlines(ctx, generatedEntities);

  ctx.setTransform(1, 0, 0, 1, 0, 0);
}
