import { generateAllEntities } from "./generators";
import { drawScene } from "./scene";
import type { GeneratedEntities, VirtualCanvas, VirtualCanvasContext } from "./types";

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
  // Draw the scene onto the virtual canvas
  drawScene(virtualCtx, generatedEntities);

  // Draw virtual canvas onto main canvas
  const width = mainCanvas.width;
  const height = mainCanvas.height;
  const scale = height / virtualCanvas.height;
  const maxWidth = virtualCanvas.width * scale;
  const x = (width - maxWidth) / 2;

  mainCtx.clearRect(0, 0, width, height);
  mainCtx.drawImage(
    virtualCanvas,
    0,
    0,
    virtualCanvas.width,
    virtualCanvas.height,
    x,
    0,
    maxWidth,
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
  window.addEventListener("resize", () => resizeCanvasToDisplaySize(mainCanvas));

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
      lastFrameTime += frames * frameDuration;

      drawFrame(mainCanvas, mainCtx, virtualCanvas, virtualCtx, generatedEntities);
    }
    requestAnimationFrame(loop);
  });
}
