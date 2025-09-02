import type { Point, VirtualCanvasContext } from "../types";
import { lerpPointToPerspective } from "./transform";
import { polygon } from './';

/**
 * Draws a cube in 1-point perspective
 * @param ctx The canvas context to draw on
 * @param tl The top-left point of the front face
 * @param tr The top-right point of the front face
 * @param perspectivePoint The vanishing point for the perspective
 * @param depth The depth of the cube in pixels
 * @param frontColor The color to fill the front face of the cube
 * @param sideColor The color to fill the side face of the cube
 * @param topColor The color to fill the top face of the cube
 */
export function cube1(
  ctx: VirtualCanvasContext,
  tl: Point,
  br: Point,
  perspectivePoint: Point,
  depth: number,
  frontColor: string,
  sideColor: string,
  topColor: string,
) {
  const tr: Point = [br[0], tl[1]];
  const bl: Point = [tl[0], br[1]];

  // Convert pixel depth to lerp factor t
  const dx = perspectivePoint[0] - tl[0];
  const dy = perspectivePoint[1] - tl[1];
  const t = depth / Math.hypot(dx, dy);

  // Find back points
  const backTl: Point = lerpPointToPerspective(tl, perspectivePoint, t);
  const backTr: Point = lerpPointToPerspective(tr, perspectivePoint, t);
  const backBr: Point = lerpPointToPerspective(br, perspectivePoint, t);
  const backBl: Point = lerpPointToPerspective(bl, perspectivePoint, t);

  const isLeftFaceVisible = perspectivePoint[0] < tl[0];
  const isTopFaceVisible = perspectivePoint[1] < tl[1];

  // Draw front face
  polygon(ctx, [tl, tr, br, bl], frontColor);

  // Draw side face
  if (isLeftFaceVisible) {
    polygon(ctx, [tl, bl, backBl, backTl], sideColor);
  } else {
    polygon(ctx, [tr, br, backBr, backTr], sideColor);
  }

  // Draw top/bottom face
  if (isTopFaceVisible) {
    polygon(ctx, [tl, tr, backTr, backTl], topColor);
  } else {
    polygon(ctx, [bl, br, backBr, backBl], topColor);
  }
}
