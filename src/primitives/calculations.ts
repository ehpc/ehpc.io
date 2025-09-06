import type { Point } from "../types";

export function distance(p1: Point, p2: Point): number {
  const dx = p2[0] - p1[0];
  const dy = p2[1] - p1[1];
  return Math.sqrt(dx * dx + dy * dy);
}

export function distanceToRectCenter(point: Point, rect: [Point, Point]): number {
  const rectCenter: Point = [
    (rect[0][0] + rect[1][0]) / 2,
    (rect[0][1] + rect[1][1]) / 2,
  ];
  return distance(point, rectCenter);
}

export function isPointInsideRect(point: Point, rect: [Point, Point]): boolean {
  return (
    point[0] >= rect[0][0]
    && point[0] <= rect[1][0]
    && point[1] >= rect[0][1]
    && point[1] <= rect[1][1]
  );
}
