import { DESK_OFFSET_X_THRESHOLD } from "../constants";
import { polygon, rect } from "../primitives";
import colors from "../styles/colors.module.css";
import type { DrawingCoordinates, VirtualCanvasContext } from "../types";

function drawTable(ctx: VirtualCanvasContext) {
  // Bottom front legs
  polygon(ctx, [[310, 291], [80, 282], [80, 320], [310, 320]], colors.tableBottomColor);
  // Front facing edge
  polygon(ctx, [[115, 305], [332, 273], [332, 288], [115, 329]], colors.tableTopShadowColor);
  // Left facing edge
  polygon(ctx, [[115, 305], [115, 329], [64, 273], [64, 257]], colors.tableTopShadowColor2);
  // Top
  polygon(ctx, [[64, 257], [257, 245], [332, 273], [115, 305]], colors.tableTopColor);
}

function drawPCBox(ctx: VirtualCanvasContext) {
  // Left face
  polygon(ctx, [[106, 254], [106, 236], [124, 248], [124, 268]], colors.pcBoxColorLeft);
  // Front face
  polygon(ctx, [[124, 268], [124, 248], [210, 243], [210, 261]], colors.pcBoxColorFront);
  // Top face
  polygon(ctx, [[106, 236], [124, 248], [210, 243], [186, 233]], colors.pcBoxColorTop);
  // Display stand
  polygon(ctx, [[122, 228], [187, 228], [187, 240], [133, 242], [122, 236]], colors.pcBoxColorFront);
}

function drawDisplay(ctx: VirtualCanvasContext) {
  // Back
  polygon(ctx, [[121, 167], [121, 222], [112, 217], [112, 174]], colors.pcBoxColorLeft);
  polygon(ctx, [[124, 158], [124, 231], [121, 227], [121, 161]], colors.displayShadowColor);
  // Front
  polygon(ctx, [[124, 158], [124, 231], [206, 228], [206, 161]], colors.displayFrameColor);
  // Button
  rect(ctx, 186, 222, 195, 225, colors.displayButtonColor);
}

function drawDisplayGlass(ctx: VirtualCanvasContext) {
  // Glass
  polygon(ctx, [[134, 169], [134, 218], [197, 217], [197, 170]], colors.displayGlassColor);
  // Reflection
  rect(ctx, 180, 176, 190, 181, colors.displayReflectionColor);
}

function drawKeyboard(ctx: VirtualCanvasContext) {
  // Left edge
  polygon(ctx, [[156, 287], [156, 276], [131, 252], [131, 270]], colors.keyboardLeftColor);
  // Front edge
  polygon(ctx, [[156, 287], [156, 276], [256, 266], [256, 275]], colors.keyboardFrontColor);
  // Top edge
  polygon(ctx, [[256, 266], [156, 276], [131, 252], [231, 247]], colors.keyboardTopColor);
  // Keypad
  polygon(ctx, [[162, 271], [145, 255], [227, 250], [245, 264]], colors.keyboardKeypadColor);
  // Buttons
  polygon(ctx, [[159, 262], [229, 257], [236, 262], [164, 267]], colors.keyboardTopColor);
  polygon(ctx, [[154, 256], [224, 252], [229, 255], [157, 260]], colors.keyboardTopColor);
  polygon(ctx, [[170, 267], [174, 267], [164, 255], [159, 255]], colors.keyboardKeypadColor);
  polygon(ctx, [[170, 254], [173, 254], [178, 260], [175, 260]], colors.keyboardKeypadColor);
  polygon(ctx, [[180, 254], [183, 254], [188, 260], [185, 260]], colors.keyboardKeypadColor);
  polygon(ctx, [[189, 254], [191, 254], [197, 259], [193, 259]], colors.keyboardKeypadColor);
  polygon(ctx, [[198, 253], [201, 253], [206, 259], [203, 259]], colors.keyboardKeypadColor);
  polygon(ctx, [[207, 253], [210, 253], [224, 265], [222, 265]], colors.keyboardKeypadColor);
  polygon(ctx, [[221, 257], [225, 257], [232, 265], [231, 265]], colors.keyboardKeypadColor);
}

export function drawDeskScene(
  ctx: VirtualCanvasContext,
  drawingCoordinates: DrawingCoordinates,
) {
  const deskOffset = Math.max(0, drawingCoordinates.virtualX - DESK_OFFSET_X_THRESHOLD);
  ctx.translate(deskOffset, 0);

  drawTable(ctx);
  drawPCBox(ctx);
  drawDisplay(ctx);
  drawDisplayGlass(ctx);
  drawKeyboard(ctx);

  ctx.setTransform(1, 0, 0, 1, 0, 0);
}
