import { MAX_STARS, RESIZE_DELAY, VIRTUAL_CANVAS_X_THRESHOLD } from "./constants";
import {
  generateAllEntities,
  generateRollingScanlines,
  generateServerBoxes,
  generateServerBoxTexts,
  generateStars,
} from "./generators";
import { drawCrtEffect, drawEdges, drawMainScene } from "./scenes";
import type { GeneratedEntities, VirtualCanvas, VirtualCanvasContext } from "./types";
import { debounce } from "./utils";

function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const displayWidth = Math.round(rect.width * dpr);
  const displayHeight = Math.round(rect.height * dpr);
  canvas.width = displayWidth;
  canvas.height = displayHeight;
}

const drawingCoordinates = {
  virtualWidth: 0,
  virtualHeight: 0,
  virtualX: 0,
  drawingWidth: 0,
  drawingHeight: 0,
  canvasOffsetX: 0,
  canvasOffsetY: 0,
};

function drawFrame(
  mainCanvas: HTMLCanvasElement,
  mainCtx: CanvasRenderingContext2D,
  virtualCanvas: VirtualCanvas,
  virtualCtx: VirtualCanvasContext,
  generatedEntities: GeneratedEntities,
) {
  virtualCtx.imageSmoothingEnabled = false;
  mainCtx.imageSmoothingEnabled = false;
  virtualCtx.textRendering = "geometricPrecision";
  mainCtx.textRendering = "geometricPrecision";

  const { width, height } = mainCanvas.getBoundingClientRect();
  // Calculate dimensions
  let drawingHeight = height;
  const scaleY = height / virtualCanvas.height;
  let drawingWidth = virtualCanvas.width * scaleY;
  let virtualX = 0;
  let virtualWidth = virtualCanvas.width;

  // Maintain most of the scene visible by squishing it vertically
  if (drawingWidth > width) {
    const dX = (drawingWidth - width) / 2;
    virtualX = dX / scaleY;
    if (virtualX > VIRTUAL_CANVAS_X_THRESHOLD) {
      virtualX = VIRTUAL_CANVAS_X_THRESHOLD;
    }
    virtualWidth = virtualCanvas.width - virtualX * 2;
    if (virtualX >= VIRTUAL_CANVAS_X_THRESHOLD) {
      const scaleX = width / virtualWidth;
      drawingHeight = virtualCanvas.height * scaleX;
    }
    drawingWidth = width;
  }
  // Center the scene
  const x = (width - drawingWidth) / 2;
  const y = height - drawingHeight;

  // Draw the main scene onto the virtual canvas
  drawMainScene(virtualCtx, generatedEntities, virtualX);

  drawingCoordinates.virtualWidth = virtualWidth;
  drawingCoordinates.virtualHeight = virtualCanvas.height;
  drawingCoordinates.drawingWidth = drawingWidth;
  drawingCoordinates.drawingHeight = drawingHeight;
  drawingCoordinates.canvasOffsetX = x;
  drawingCoordinates.canvasOffsetY = y;
  drawingCoordinates.virtualX = virtualX;

  // Apply device pixel ratio
  const dpr = window.devicePixelRatio || 1;
  mainCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

  // Fill empty space around main scene
  drawEdges(mainCtx, x, y);

  // Draw the virtual canvas onto the main canvas
  mainCtx.drawImage(
    virtualCanvas,
    virtualX,
    0,
    virtualWidth,
    virtualCanvas.height,
    x,
    y,
    drawingWidth,
    drawingHeight,
  );

  // Apply retro CRF effect
  drawCrtEffect(mainCtx);
}

export function renderLoop(
  mainCanvas: HTMLCanvasElement,
  mainCtx: CanvasRenderingContext2D,
  virtualCanvas: OffscreenCanvas | HTMLCanvasElement,
  virtualCtx: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D,
) {
  // Resize main canvas to fit the display size
  resizeCanvasToDisplaySize(mainCanvas, mainCtx);
  window.addEventListener(
    "resize",
    debounce(() => {
      resizeCanvasToDisplaySize(mainCanvas, mainCtx);
      drawFrame(mainCanvas, mainCtx, virtualCanvas, virtualCtx, generatedEntities);
    }, RESIZE_DELAY),
  );

  const generatedEntities = generateAllEntities();

  window.addEventListener("mousemove", (event) => {
    const kX = drawingCoordinates.virtualWidth / drawingCoordinates.drawingWidth;
    const kY = drawingCoordinates.virtualHeight / drawingCoordinates.drawingHeight;
    generatedEntities.cursorPosition = [
      (event.clientX - drawingCoordinates.canvasOffsetX) * kX + drawingCoordinates.virtualX,
      (event.clientY - drawingCoordinates.canvasOffsetY) * kY,
    ];
  });

  const targetFPS = 24;
  const frameDuration = 1000 / targetFPS;
  let lastFrameTime = 0;

  requestAnimationFrame(function loop(time: DOMHighResTimeStamp) {
    if (lastFrameTime === 0) lastFrameTime = time;

    const deltaTime = time - lastFrameTime;
    if (deltaTime >= frameDuration) {
      // Keep stable draw cadence
      const frames = (deltaTime / frameDuration) >> 0;
      const elapsedStable = frames * frameDuration;
      lastFrameTime += elapsedStable;

      generatedEntities.stars = generateStars(generatedEntities.stars, MAX_STARS, elapsedStable);
      generatedEntities.serverBoxes = generateServerBoxes(generatedEntities.serverBoxes, elapsedStable);
      generatedEntities.rollingScanlines = generateRollingScanlines(generatedEntities.rollingScanlines, elapsedStable);
      generatedEntities.serverBoxTextes = generateServerBoxTexts(generatedEntities.serverBoxTextes, elapsedStable);
      drawFrame(mainCanvas, mainCtx, virtualCanvas, virtualCtx, generatedEntities);
    }
    requestAnimationFrame(loop);
  });
}
