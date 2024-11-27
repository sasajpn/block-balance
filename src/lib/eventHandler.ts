import Matter from "matter-js";

export function handleMove(
  event: MouseEvent | TouchEvent,
  render: Matter.Render,
  body: Matter.Body
) {
  const rect = render.canvas.getBoundingClientRect();
  const x = getEventX(event, rect);

  Matter.Body.setPosition(body, {
    x: x,
    y: 100,
  });
}

export function handleDrop(body: Matter.Body) {
  Matter.Body.setStatic(body, false);
  body.render.opacity = 1;
  body.collisionFilter.category = 0x0001;
  body.collisionFilter.mask = 0xffff;
}

function getEventX(event: MouseEvent | TouchEvent, rect: DOMRect): number {
  if (event instanceof MouseEvent) {
    return event.clientX - rect.left;
  } else if (event instanceof TouchEvent && event.touches.length > 0) {
    return event.touches[0].clientX - rect.left;
  }
  return 0;
}
