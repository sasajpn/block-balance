export function resizeCanvas(
  canvas: HTMLCanvasElement,
  render: Matter.Render,
  maxWidth = 500,
  aspectRatio = 9 / 16
) {
  const width = Math.min(window.innerWidth, maxWidth);
  const height = width / aspectRatio;

  canvas.width = width;
  canvas.height = height;

  render.options.width = width;
  render.options.height = height;
}
