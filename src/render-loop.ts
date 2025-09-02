import { MAX_STARS, RESIZE_DELAY } from "./constants";
import { generateAllEntities, generateServerBoxes, generateStars } from "./generators";
import { drawEdges, drawMainScene } from "./scenes";
import type { GeneratedEntities, VirtualCanvas, VirtualCanvasContext } from "./types";
import { debounce } from "./utils";

function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement): boolean {
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const rect = canvas.getBoundingClientRect();
  const displayWidth = Math.round(rect.width * dpr);
  const displayHeight = Math.round(rect.height * dpr);
  if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
    canvas.width = displayWidth;
    canvas.height = displayHeight;
    return true;
  }
  return false;
}

function drawFrame(
  mainCanvas: HTMLCanvasElement,
  mainCtx: CanvasRenderingContext2D,
  virtualCanvas: VirtualCanvas,
  virtualCtx: VirtualCanvasContext,
  generatedEntities: GeneratedEntities,
) {
  virtualCtx.imageSmoothingEnabled = false;
  mainCtx.imageSmoothingEnabled = false;
  // Draw the main scene onto the virtual canvas
  drawMainScene(virtualCtx, generatedEntities);

  // Draw virtual canvas onto main canvas
  const width = mainCanvas.width;
  let height = mainCanvas.height;
  const scaleY = height / virtualCanvas.height;
  let realWidth = virtualCanvas.width * scaleY;
  let virtualX = 0;
  let virtualWidth = virtualCanvas.width;

  // Maintain most of the scene visible by squishing it vertically
  if (realWidth > width) {
    const dX = (realWidth - width) / 2;
    virtualX = dX / scaleY;
    if (virtualX > 57) {
      virtualX = 57;
    }
    virtualWidth = virtualCanvas.width - virtualX * 2;
    if (virtualX >= 57) {
      const scaleX = width / virtualWidth;
      height = virtualCanvas.height * scaleX;
    }
    realWidth = width;
  }
  const x = (width - realWidth) / 2;
  const y = mainCanvas.height - height;

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
    realWidth,
    height,
  );
}

export function renderLoop(
  mainCanvas: HTMLCanvasElement,
  mainCtx: CanvasRenderingContext2D,
  virtualCanvas: OffscreenCanvas | HTMLCanvasElement,
  virtualCtx: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D,
) {
  // Resize main canvas to fit the display size
  resizeCanvasToDisplaySize(mainCanvas);
  window.addEventListener(
    "resize",
    debounce(() => {
      resizeCanvasToDisplaySize(mainCanvas);
      drawFrame(mainCanvas, mainCtx, virtualCanvas, virtualCtx, generatedEntities);
    }, RESIZE_DELAY),
  );

  const generatedEntities = generateAllEntities();

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
      drawFrame(mainCanvas, mainCtx, virtualCanvas, virtualCtx, generatedEntities);
    }
    requestAnimationFrame(loop);
  });
}
