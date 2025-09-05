export function drawCrtEffect(ctx: CanvasRenderingContext2D) {
  const { width, height } = ctx.canvas;
  const previousTransform = ctx.getTransform();
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  // Draw RGB vertical lines
  const rgbIntensity = 0.1;
  for (let i = 0; i < width; i += 3) {
    ctx.fillStyle = `rgb(255, 0, 0, ${rgbIntensity})`;
    ctx.fillRect(i, 0, 1, height);
    ctx.fillStyle = `rgb(0, 255, 0, ${rgbIntensity})`;
    ctx.fillRect(i + 1, 0, 1, height);
    ctx.fillStyle = `rgb(0, 0, 255, ${rgbIntensity})`;
    ctx.fillRect(i + 2, 0, 1, height);
  }

  // Draw scanlines
  const scanlineHeight = 3;
  const scanlineIntensity = 0.1;
  for (let i = 0; i < height; i += scanlineHeight * 2) {
    ctx.fillStyle = `rgba(0, 0, 0, ${scanlineIntensity})`;
    ctx.fillRect(0, i, width, scanlineHeight);
  }

  ctx.setTransform(previousTransform);
}
