import type { Point, Rect } from "../types";

// Shear parameters for vertical shear transformation
interface ShearParams {
  // Shear factor
  k: number;
  // X-coordinate of the shear origin
  x0: number;
}

/**
 * Maps the points of a rectangle using a mapping function.
 * @param rect The points of the rectangle [TL, TR, BR, BL].
 * @param mapFn The mapping function to apply to each point.
 * @returns The transformed rectangle.
 */
function mapRect(rect: Rect, mapFn: (point: Point) => Point): Rect {
  return [
    mapFn(rect[0]),
    mapFn(rect[1]),
    mapFn(rect[2]),
    mapFn(rect[3]),
  ];
}

/**
 * Linearly interpolates a point towards a perspective point.
 * @param p The original point.
 * @param perspective The perspective point to interpolate towards.
 * @param t The interpolation factor (0 to 1).
 * @returns The interpolated point.
 */
export function lerpPointToPerspective(p: Point, perspective: Point, t: number): Point {
  const dx = perspective[0] - p[0];
  const dy = perspective[1] - p[1];
  return [p[0] + dx * t, p[1] + dy * t];
}

/**
 * Scales the points of a rectangle preserving center pivot.
 * @param points The points of the rectangle on 2D space [TL, TR, BR, BL].
 * @param scaleX The scale factor in the X direction.
 * @param scaleY The scale factor in the Y direction.
 */
export function scaleRectPoints(points: Rect, scaleX: number, scaleY: number = scaleX): Rect {
  const centerX = (points[0][0] + points[1][0]) / 2;
  const centerY = (points[0][1] + points[3][1]) / 2;

  return mapRect(points, ([x, y]) => [
    centerX + (x - centerX) * scaleX,
    centerY + (y - centerY) * scaleY,
  ]);
}

/**
 * Embeds a rectangle inside another rectangle with the given padding.
 * @param rect The points of the outer rectangle [TL, TR, BR, BL].
 * @param padding The padding to apply to each side [top, right, bottom, left].
 * @returns The points of the inner rectangle [TL, TR, BR, BL].
 */
export function embedRectInsideRect(rect: Rect, padding: [number, number, number, number]): Rect {
  const [tl, tr, br, bl] = rect;
  const [padTop, padRight, padBottom, padLeft] = padding;
  return [
    [tl[0] + padLeft, tl[1] + padTop],
    [tr[0] - padRight, tr[1] + padTop],
    [br[0] - padRight, br[1] - padBottom],
    [bl[0] + padLeft, bl[1] - padBottom],
  ];
}

/**
 * Gets the shear parameters for vertical shear transformation at the right side.
 * @param rect The points of the rectangle [TL, TR, BR, BL].
 * @param dY The vertical displacement for the shear.
 * @returns The shear parameters for the right side of the rectangle.
 */
export function getShearRectRightSideVerticalParams(rect: Rect, dY: number): ShearParams {
  const [tl, tr] = rect;
  const width = tr[0] - tl[0];
  const k = -dY / width;
  const x0 = tl[0];
  return { k, x0 };
}

/**
 * Shears a point vertically based on the given shear parameters.
 * @param point The point to shear.
 * @param shearParams The shear parameters.
 * @returns The sheared point.
 */
function shearPoint(point: Point, shearParams: ShearParams): Point {
  return [point[0], point[1] + shearParams.k * (point[0] - shearParams.x0)];
}

/**
 * Shears the right side of a rectangle vertically based on the given shear parameters.
 * @param rect The points of the rectangle [TL, TR, BR, BL].
 * @param shearParams The shear parameters.
 * @returns The sheared points of the rectangle [TL, TR, BR, BL].
 */
export function shearRectRightSideVertical(rect: Rect, shearParams: ShearParams): Rect {
  return mapRect(rect, point => shearPoint(point, shearParams));
}

/**
 * Creates the points of a rectangle on 2D space.
 * @param x The x-coordinate of the top-left corner.
 * @param y The y-coordinate of the top-left corner.
 * @param width The width of the rectangle.
 * @param height The height of the rectangle.
 * @returns The points of the rectangle on 2D space [TL, TR, BR, BL].
 */
export function rectPoints(x: number, y: number, width: number, height: number): Rect {
  return [
    [x, y],
    [x + width, y],
    [x + width, y + height],
    [x, y + height],
  ];
}
