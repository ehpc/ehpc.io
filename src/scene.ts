import colors from "./colors.module.css";

export function drawScene(
  ctx: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D,
) {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = colors.wallColor;
  ctx.fillRect(0, 0, width, height);
}
