import { Bodies, Body } from "matter-js";
import type { Vertice } from "../types";

const airCategory = 0x0002;

export function createGround(canvas: HTMLCanvasElement) {
  return Bodies.rectangle(
    canvas.width / 2,
    canvas.height - 50,
    canvas.width - 100,
    25,
    {
      isStatic: true,
      friction: 1.0,
      frictionStatic: 1.0,
      render: {
        fillStyle: "#EE82EE",
      },
    }
  );
}

export function createKanji(
  x: number,
  y: number,
  vertexSets: Vertice[][],
  pngFile: string
) {
  const body = Bodies.fromVertices(x, y, vertexSets, {
    label: "kanji",
    friction: 1.0,
    frictionStatic: 1.0,
    frictionAir: 0.03,
    restitution: 0.0,
    render: {
      opacity: 0.5,
      sprite: {
        texture: pngFile,
        xScale: 0.3,
        yScale: 0.3,
      },
    },
    collisionFilter: {
      category: airCategory,
      mask: airCategory,
    },
  });

  Body.setStatic(body, true);
  Body.scale(body, 0.3, 0.3);

  return body;
}
