import {
  embedRectInsideRect,
  getRectHeight,
  getRectWidth,
  getShearRectRightSideVerticalParams,
  line,
  polygon,
  rect,
  rectPoints,
  rectRect,
  reverseRect,
  rightTriangle,
  scaleRectPoints,
  shearRectRightSideVertical,
} from "../primitives";
import colors from "../styles/colors.module.css";
import type { Rect, VirtualCanvasContext } from "../types";

type ServerBoxType = "buttonned" | "slotted";

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

function drawSkewedServerBoxWithTwoSquares(ctx: VirtualCanvasContext, baseRect: Rect) {
  const shearParams = getShearRectRightSideVerticalParams(baseRect, 10);
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

function drawSkewedServerBoxWithTwoLines(ctx: VirtualCanvasContext, baseRect: Rect) {
  const shearParams = getShearRectRightSideVerticalParams(baseRect, 10);
  const shearedRect = shearRectRightSideVertical(baseRect, shearParams);
  polygon(ctx, shearedRect, colors.serverBoxShadowColor);
  const innerRect = scaleRectPoints(baseRect, 0.6, 0.7);
  const innerRectSheared = shearRectRightSideVertical(innerRect, shearParams);
  polygon(ctx, innerRectSheared, colors.wallColor);
  const topInnerRect = shearRectRightSideVertical(embedRectInsideRect(innerRect, [5, 5, 16, 5]), shearParams);
  polygon(ctx, topInnerRect, colors.serverBoxShadowColor);
  const bottomInnerRect = shearRectRightSideVertical(embedRectInsideRect(innerRect, [16, 5, 5, 5]), shearParams);
  polygon(ctx, bottomInnerRect, colors.serverBoxShadowColor);
}

function drawStraightServerBox(
  ctx: VirtualCanvasContext,
  rect: Rect,
  type: ServerBoxType,
  halfingCoeff: number,
  borderWidth: number,
  innerPadding: number,
  detailColor: string,
) {
  rectRect(ctx, rect, colors.serverBoxHighlightedColor);
  const innerRect = embedRectInsideRect(rect, [borderWidth, borderWidth, borderWidth, borderWidth]);
  const innerRectHeight = getRectHeight(innerRect);
  const halvedInnerRectHeight = innerRectHeight * halfingCoeff;
  const topInnerRectHeight = innerRectHeight - halvedInnerRectHeight;
  innerRect[2][1] -= halvedInnerRectHeight;
  innerRect[3][1] -= halvedInnerRectHeight;
  rectRect(ctx, innerRect, colors.wallColor);
  const topInnerRect = embedRectInsideRect(rect, [borderWidth, borderWidth, borderWidth, borderWidth]);
  topInnerRect[0][1] += topInnerRectHeight;
  topInnerRect[1][1] += topInnerRectHeight;
  rectRect(ctx, topInnerRect, detailColor);

  if (type === "buttonned") {
    const innerRectWidth = getRectWidth(innerRect);
    const halvedInnerRectWidth = (innerRectWidth / 2) | 0;
    const topLeftDetail = embedRectInsideRect(innerRect, [
      innerPadding,
      halvedInnerRectWidth + 3,
      innerPadding,
      innerPadding,
    ]);
    rectRect(ctx, topLeftDetail, detailColor);
    const topRightDetail = embedRectInsideRect(innerRect, [
      innerPadding,
      innerPadding,
      innerPadding,
      halvedInnerRectWidth + 3,
    ]);
    rectRect(ctx, topRightDetail, detailColor);
    const bottomLeftDetail = embedRectInsideRect(topInnerRect, [
      innerPadding,
      halvedInnerRectWidth + 3,
      innerPadding,
      innerPadding,
    ]);
    rectRect(ctx, bottomLeftDetail, colors.wallColor);
    const bottomRightDetail = embedRectInsideRect(topInnerRect, [
      innerPadding,
      innerPadding,
      innerPadding,
      halvedInnerRectWidth + 3,
    ]);
    rectRect(ctx, bottomRightDetail, colors.wallColor);
  } else if (type === "slotted") {
    const extraDetails = halfingCoeff < 0.5;
    const halvedTopInnerRectHeight = (topInnerRectHeight / (extraDetails ? 1.5 : 2)) | 0;
    const detail1 = embedRectInsideRect(innerRect, [
      innerPadding,
      innerPadding,
      halvedTopInnerRectHeight + 4,
      innerPadding,
    ]);
    rectRect(ctx, detail1, detailColor);
    const detail2 = embedRectInsideRect(innerRect, [
      halvedTopInnerRectHeight + 2,
      innerPadding,
      innerPadding,
      innerPadding,
    ]);
    rectRect(ctx, detail2, detailColor);
    if (halfingCoeff < 0.5) {
      const detail3 = embedRectInsideRect(innerRect, [
        halvedTopInnerRectHeight - 3,
        innerPadding,
        halvedTopInnerRectHeight - 3,
        innerPadding,
      ]);
      rectRect(ctx, detail3, detailColor);
    }
  }
}

function drawServerBoxes(ctx: VirtualCanvasContext) {
  drawSkewedServerBoxWithTwoSquares(ctx, rectPoints(428, 52, 35, 28));
  drawSkewedServerBoxWithTwoLines(ctx, rectPoints(415, 107, 36, 38));
  rect(ctx, 360, 169, 430, 250, colors.serverBoxDeepShadowColor);
  drawStraightServerBox(ctx, rectPoints(397, 151, 45, 54), "buttonned", 0.55, 6, 7, colors.serverBoxDetail1Color);
  drawStraightServerBox(ctx, rectPoints(381, 207, 46, 92), "slotted", 0.65, 7, 6, colors.serverBoxDetail2Color);
  drawStraightServerBox(ctx, rectPoints(340, 187, 33, 24), "buttonned", 0.5, 5, 4, colors.serverBoxDetail1Color);
  drawStraightServerBox(ctx, rectPoints(315, 213, 44, 86), "slotted", 0.4, 7, 6, colors.serverBoxDetail2Color);
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
