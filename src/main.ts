import "./main.css";

const canvas = document.getElementById("scene-canvas");
if (!(canvas instanceof HTMLCanvasElement)) {
  throw new Error("Failed to find canvas element");
}

const ctx = canvas.getContext("2d");
if (!ctx) {
  throw new Error("Failed to get canvas 2D context");
}

function render(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#010a26";
  ctx.fillRect(0, 0, width, height);
  requestAnimationFrame(() => render(ctx, width, height));
}

render(ctx, canvas.width, canvas.height);
