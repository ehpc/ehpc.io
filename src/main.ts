import "./styles/main.css";
import { createVirtualCanvas } from "./canvas.ts";
import { VIRTUAL_CANVAS_HEIGHT, VIRTUAL_CANVAS_WIDTH } from "./constants.ts";
import { renderLoop } from "./render-loop.ts";

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
const virtualCanvas = createVirtualCanvas(VIRTUAL_CANVAS_WIDTH, VIRTUAL_CANVAS_HEIGHT);
const virtualCtx = virtualCanvas.getContext("2d");
if (!virtualCtx) {
  throw new Error("Failed to get virtual canvas 2D context");
}

// Fire up the render loop
renderLoop(mainCanvas, mainCtx, virtualCanvas, virtualCtx);
