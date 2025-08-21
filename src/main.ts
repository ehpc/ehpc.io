import "./main.css";
import { createCanvas } from "./canvas.ts";
import { renderLoop } from "./render-loop.ts";

// Virtual canvas dimensions
const VIRTUAL_CANVAS_WIDTH = 160;
const VIRTUAL_CANVAS_HEIGHT = 90;

// Set up main canvas
const mainCanvas = document.getElementById("scene-canvas");
if (!(mainCanvas instanceof HTMLCanvasElement)) {
  throw new Error("Failed to find canvas element");
}
const mainCtx = mainCanvas.getContext("2d");
if (!mainCtx) {
  throw new Error("Failed to get canvas 2D context");
}

// Set up virtual canvas for pixelated drawing
const virtualCanvas = typeof OffscreenCanvas !== "undefined"
  ? new OffscreenCanvas(VIRTUAL_CANVAS_WIDTH, VIRTUAL_CANVAS_HEIGHT)
  : createCanvas(VIRTUAL_CANVAS_WIDTH, VIRTUAL_CANVAS_HEIGHT);
const virtualCtx = virtualCanvas.getContext("2d");
if (!virtualCtx) {
  throw new Error("Failed to get virtual canvas 2D context");
}

// Disable image smoothing for pixelated effect
mainCtx.imageSmoothingEnabled = false;
virtualCtx.imageSmoothingEnabled = false;

// Fire up the render loop
renderLoop(mainCanvas, mainCtx, virtualCanvas, virtualCtx);
