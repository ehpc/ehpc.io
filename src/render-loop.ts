import { drawScene } from "./scene";

export function renderLoop(
  mainCanvas: HTMLCanvasElement,
  mainCtx: CanvasRenderingContext2D,
  virtualCanvas: OffscreenCanvas | HTMLCanvasElement,
  virtualCtx: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D,
) {
  drawScene(virtualCtx);
  const { width, height } = mainCanvas.getBoundingClientRect();
  mainCtx.clearRect(0, 0, width, height);
  mainCtx.drawImage(
    virtualCanvas,
    0,
    0,
    virtualCanvas.width,
    virtualCanvas.height,
    0,
    0,
    width,
    height,
  );
  requestAnimationFrame(() => renderLoop(mainCanvas, mainCtx, virtualCanvas, virtualCtx));
}
