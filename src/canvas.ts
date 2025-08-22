import type { VirtualCanvas } from "./types";

export function createCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

export function createVirtualCanvas(width: number, height: number): VirtualCanvas {
  return typeof OffscreenCanvas !== "undefined"
    ? new OffscreenCanvas(width, height)
    : createCanvas(width, height);
}
