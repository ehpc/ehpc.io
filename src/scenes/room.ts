import {
  embedRectInsideRect,
  getShearRectRightSideVerticalParams,
  line,
  polygon,
  rect,
  rectPoints,
  reverseRect,
  rightTriangle,
  scaleRectPoints,
  shearRectRightSideVertical,
} from "../primitives";
import colors from "../styles/colors.module.css";
import type { Rect, VirtualCanvasContext } from "../types";

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
  rightTriangle(ctx, 131, 59, 5, 5, colors.windowFrameColor, "NW");
  rightTriangle(ctx, 131, 196, 5, 5, colors.windowFrameColor, "SW");
  rightTriangle(ctx, 377, 196, 5, 5, colors.windowFrameColor, "SE");
  rightTriangle(ctx, 377, 59, 5, 5, colors.windowFrameColor, "NE");

  // Frame
  const thickness = 12;
  rect(ctx, 131 - thickness - 1, 59, 130, 195, colors.windowFrameColor);
  rect(ctx, 377, 59, 377 + thickness, 195, colors.windowFrameColor);
  rect(ctx, 131 - thickness - 1, 58, 377 + thickness, 59 - thickness + 1, colors.windowFrameColor);
  rect(ctx, 131 - thickness - 1, 196, 377 + thickness, 196 + thickness - 2, colors.windowFrameColor);

  // Outer corners
  rightTriangle(ctx, 131 - thickness - 1, 59 - thickness + 1, 10, 10, colors.wallColor, "NW");
  rightTriangle(ctx, 131 - thickness - 1, 196 + thickness - 1, 10, 10, colors.wallColor, "SW");
  rightTriangle(ctx, 377 + thickness + 1, 196 + thickness - 1, 10, 10, colors.wallColor, "SE");
  rightTriangle(ctx, 377 + thickness + 1, 59 - thickness + 1, 10, 10, colors.wallColor, "NE");

  // Draw inner outline
  line(ctx, 136, 58, 371, 58, colors.windowFrameOutlineHighlightedColor);
  line(ctx, 136, 196, 371, 196, colors.windowFrameOutlineHighlightedColor);
  line(ctx, 130, 64, 130, 190, colors.windowFrameOutlineHighlightedColor);
  line(ctx, 377, 64, 377, 190, colors.windowFrameOutlineHighlightedColor);
}

function drawServerBoxWithTwoSquares(ctx: VirtualCanvasContext, baseRect: Rect) {
  const shearParams = getShearRectRightSideVerticalParams(baseRect, 15);
  const shearedRect = shearRectRightSideVertical(baseRect, shearParams);
  polygon(ctx, shearedRect, colors.serverBoxShadowColor);
  const innerRect = scaleRectPoints(baseRect, 0.6);
  const innerRectSheared = shearRectRightSideVertical(innerRect, shearParams);
  polygon(ctx, innerRectSheared, colors.wallColor);
  const leftInnerRect = shearRectRightSideVertical(embedRectInsideRect(innerRect, [5, 12, 5, 4]), shearParams);
  polygon(ctx, leftInnerRect, colors.serverBoxShadowColor);
  const rightInnerRect = shearRectRightSideVertical(embedRectInsideRect(innerRect, [5, 4, 5, 12]), shearParams);
  polygon(ctx, rightInnerRect, colors.serverBoxShadowColor);
}

function drawServerBoxes(ctx: VirtualCanvasContext) {
  drawServerBoxWithTwoSquares(ctx, rectPoints(428, 52, 35, 28));
}

export function drawRoomScene(ctx: VirtualCanvasContext) {
  drawBackground(ctx);
  // Draw wall artefacts
  // Draw god-rays
  drawWindowFrame(ctx);
  // Draw server boxes
  drawServerBoxes(ctx);
  // Draw lamp
}
