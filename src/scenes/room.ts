import { line, polygon, rect, reverseRect, rightTriangle } from "../primitives";
import colors from "../styles/colors.module.css";
import type { VirtualCanvasContext } from "../types";

function drawBackground(ctx: VirtualCanvasContext) {
  reverseRect(ctx, 131, 59, 377, 196, colors.wallColor);
  // Ceiling
  polygon(ctx, [
    [57, 0],
    [452, 0],
    [413, 24],
    [95, 24],
  ], colors.ceilingColor);
  // Left wall
  polygon(ctx, [
    [57, 0],
    [95, 24],
    [95, 269],
    [43, 317],
    [0, 317],
    [0, 0],
  ], colors.wallLeftColor);
  // Right wall
  polygon(ctx, [
    [413, 24],
    [452, 0],
    [509, 0],
    [509, 317],
    [465, 317],
    [413, 269],
  ], colors.wallRightColor);
  // Floor
  polygon(ctx, [
    [95, 269],
    [413, 269],
    [465, 317],
    [43, 317],
  ], colors.floorColor);
}

function drawWindowFrame(ctx: VirtualCanvasContext) {
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
  rect(ctx, 136, 55, 371, 58, colors.windowFrameTopOutlineColor);
  rect(ctx, 136, 196, 371, 199, colors.windowFrameBottomOutlineColor);
  rect(ctx, 130, 64, 127, 190, colors.windowFrameSideOutlineColor);
  rect(ctx, 377, 64, 380, 190, colors.windowFrameSideOutlineColor);
  polygon(ctx, [[136, 55], [136, 58], [130, 64], [127, 64]], colors.windowFrameTopOutlineColor);
  polygon(ctx, [[372, 55], [372, 58], [378, 64], [381, 64]], colors.windowFrameTopOutlineColor);
  polygon(ctx, [[127, 191], [130, 191], [136, 197], [136, 201]], colors.windowFrameSideOutlineColor);
  polygon(ctx, [[372, 196], [372, 200], [382, 191], [378, 191]], colors.windowFrameSideOutlineColor);
  rect(ctx, 136, 200, 371, 200, colors.windowFrameBottomHighlightColor);
  rect(ctx, 130, 207, 378, 208, colors.windowFrameShadowColor);
}

export function drawRoomScene(ctx: VirtualCanvasContext) {
  drawBackground(ctx);
  // Draw wall artefacts
  // Draw god-rays
  drawWindowFrame(ctx);
  // Draw lamp
}
