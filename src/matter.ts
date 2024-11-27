import Matter from "matter-js";

import { resizeCanvas } from "./lib/resizeCanvas";
import { createGround, createKanji } from "./lib/createBodies";
import { getKanjiData } from "./lib/kanjiHandler";
import { handleMove, handleDrop } from "./lib/eventHandler";

export async function Game() {
  const { Body, Engine, Render, Runner, Composite, Events } = Matter;

  const engine = Engine.create();

  const canvas = document.getElementById("kanjiTower") as HTMLCanvasElement;

  const render = Render.create({
    canvas: canvas,
    engine: engine,
    options: {
      wireframes: false,
      background: "#f0f0f0",
    },
  });

  window.addEventListener("resize", () => resizeCanvas(canvas, render));
  resizeCanvas(canvas, render);

  const ground = createGround(canvas);
  Composite.add(engine.world, [ground]);

  Render.run(render);
  Runner.run(Runner.create(), engine);

  let currentBody = createNewShape(400);

  function createNewShape(x: number) {
    const { verticesValue, pngFile } = getKanjiData();
    const shape = createKanji(x, 100, verticesValue, pngFile);
    Composite.add(engine.world, [shape]);
    return shape;
  }

  Events.on(engine, "beforeUpdate", () => {
    Body.setPosition(currentBody, {
      x: currentBody.position.x,
      y: 100,
    });
  });

  Events.on(engine, "afterUpdate", () => {
    Composite.allBodies(engine.world).forEach((body) => {
      if (body.position.y > 1200 && body.label === "kanji") {
        Composite.clear(engine.world, false);
        Composite.add(engine.world, [ground]);
        currentBody = createNewShape(400);
      }
    });
  });

  Events.on(render, "afterRender", () => {
    const context = render.context;
    context.font = "20px Arial";
    context.fillStyle = "black";

    const score =
      Composite.allBodies(engine.world).filter((body) => body.label === "kanji")
        .length - 1;
    context.fillText(`Score: ${score}`, 10, 30);
  });

  canvas.addEventListener("mousemove", (event) => {
    handleMove(event, render, currentBody);
  });

  canvas.addEventListener("mousedown", () => {
    handleDrop(currentBody);
    currentBody = createNewShape(currentBody.position.x);
  });

  canvas.addEventListener("touchmove", (event) => {
    event.preventDefault();
    handleMove(event, render, currentBody);
  });

  canvas.addEventListener("touchend", (event) => {
    event.preventDefault();
    handleDrop(currentBody);
    currentBody = createNewShape(currentBody.position.x);
  });
}
