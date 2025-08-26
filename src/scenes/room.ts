import { rightTriangle, reverseRect, rect, line, polygon } from "../primitives";
import colors from "../styles/colors.module.css";
import type { VirtualCanvasContext } from "../types";

function drawBackground(ctx: VirtualCanvasContext) {
  reverseRect(ctx, 131, 59, 377, 196, colors.wallColor);
  polygon(ctx, [
    [65, 0],
    [450, 0],
    [414, 25],
    [94, 25],
  ], colors.ceilingColor);
}

function drawWindowFrame(ctx: VirtualCanvasContext) {
  // Inner corners
  rightTriangle(ctx, 131, 59, 5, 5, colors.windowFrameColor, 'NW');
  rightTriangle(ctx, 131, 196, 5, 5, colors.windowFrameColor, 'SW');
  rightTriangle(ctx, 377, 196, 5, 5, colors.windowFrameColor, 'SE');
  rightTriangle(ctx, 377, 59, 5, 5, colors.windowFrameColor, 'NE');
  
  // Frame
  const thickness = 12;
  rect(ctx, 131 - thickness - 1, 59, 130, 195, colors.windowFrameColor);
  rect(ctx, 377, 59, 377 + thickness, 195, colors.windowFrameColor);
  rect(ctx, 131 - thickness - 1, 58, 377 + thickness, 59 - thickness + 1, colors.windowFrameColor);
  rect(ctx, 131 - thickness - 1, 196, 377 + thickness, 196 + thickness - 2, colors.windowFrameColor);

  // Outer corners
  rightTriangle(ctx, 131 - thickness - 1, 59 - thickness + 1, 10, 10, colors.wallColor, 'NW');
  rightTriangle(ctx, 131 - thickness - 1, 196 + thickness - 1, 10, 10, colors.wallColor, 'SW');
  rightTriangle(ctx, 377 + thickness + 1, 196 + thickness - 1, 10, 10, colors.wallColor, 'SE');
  rightTriangle(ctx, 377 + thickness + 1, 59 - thickness + 1, 10, 10, colors.wallColor, 'NE');

  // Draw inner outline
  line(ctx, 136, 58, 371, 58, colors.windowFrameOutlineHighlightedColor);
  line(ctx, 136, 196, 371, 196, colors.windowFrameOutlineHighlightedColor);
  line(ctx, 130, 64, 130, 190, colors.windowFrameOutlineHighlightedColor);
  line(ctx, 377, 64, 377, 190, colors.windowFrameOutlineHighlightedColor);
}

export function drawRoomScene(ctx: VirtualCanvasContext) {
  // Draw general background
  drawBackground(ctx);
  // Draw wall artefacts
  // Draw god-rays
  // Draw window frame
  drawWindowFrame(ctx);
  // Draw server boxes
  // Draw lamp
}
