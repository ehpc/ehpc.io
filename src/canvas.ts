import type { VirtualCanvas } from "./types";

/**
 * Creates a canvas element.
 * @param width The width of the canvas.
 * @param height The height of the canvas.
 * @returns A canvas element.
 */
export function createCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

/**
 * Creates a virtual canvas element.
 * @param width The width of the canvas.
 * @param height The height of the canvas.
 * @returns A virtual canvas element.
 */
export function createVirtualCanvas(width: number, height: number): VirtualCanvas {
  return typeof OffscreenCanvas !== "undefined"
    ? new OffscreenCanvas(width, height)
    : createCanvas(width, height);
}
