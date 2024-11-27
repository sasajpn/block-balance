// @ts-nocheck

import Matter from "matter-js";
import "pathseg";

import pngFiles from "./assets/png";
import verticesData from "./assets/vertices.json";

const verticesKeys = Object.keys(verticesData);

export async function Game() {
  const { Body, Engine, Render, Runner, Bodies, Composite, Events } = Matter;

  const engine = Engine.create();

  const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
      width: 800,
      height: 600,
      wireframes: false,
      background: "#f0f0f0",
    },
  });

  // 衝突カテゴリの定義
  const defaultCategory = 0x0001;
  const waitingCategory = 0x0002;
  const droppedCategory = 0x0004;

  const ground = Bodies.rectangle(400, 610, 600, 50, {
    isStatic: true,
    render: {
      fillStyle: "#666",
    },
    collisionFilter: {
      category: defaultCategory,
      mask: droppedCategory | defaultCategory,
    },
  });

  Composite.add(engine.world, [ground]);

  Render.run(render);
  Runner.run(Runner.create(), engine);

  const boxes: any = [];
  let score = 0;
  let currentBody: any = null;
  let isDropping = false;

  function clearBoxes() {
    boxes.forEach((box: any) => Composite.remove(engine.world, box));
    boxes.length = 0;
    if (currentBody) {
      Composite.remove(engine.world, currentBody);
      currentBody = null;
    }
    isDropping = false;
  }

  function createNewShape(x: number) {
    const index = Math.floor(Math.random() * verticesKeys.length);
    const verticesKey = verticesKeys[index];
    const verticesValue = verticesData[verticesKey];

    const pngFileName = `${verticesKey.replace(".svg", ".png")}`;
    const pngFileModule = pngFiles[pngFileName];
    const pngFile = pngFileModule?.default;

    const shape = Bodies.fromVertices(x, 100, verticesValue, {
      label: "box",
      render: {
        sprite: {
          texture: pngFile,
          xScale: 0.5,
          yScale: 0.5,
        },
      },
      collisionFilter: {
        category: waitingCategory,
        mask: defaultCategory,
      },
    });

    Body.scale(shape, 0.5, 0.5);
    Composite.add(engine.world, [shape]);
    return shape;
  }

  // 初期ボディの作成
  currentBody = createNewShape(400);

  Events.on(engine, "beforeUpdate", () => {
    if (currentBody && !isDropping) {
      Matter.Body.setPosition(currentBody, {
        x: currentBody.position.x,
        y: 100,
      });
      Matter.Body.setVelocity(currentBody, { x: 0, y: 0 });
      Matter.Body.setAngularVelocity(currentBody, 0);
    }
  });

  document.addEventListener("mousemove", (event) => {
    const rect = render.canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;

    if (currentBody && !isDropping) {
      Matter.Body.setPosition(currentBody, {
        x: mouseX,
        y: 100,
      });
    }
  });

  document.addEventListener("mousedown", () => {
    if (currentBody && !isDropping) {
      // 落下開始時に衝突カテゴリを変更
      currentBody.collisionFilter.category = droppedCategory;
      currentBody.collisionFilter.mask = defaultCategory | droppedCategory;

      isDropping = true;
      boxes.push(currentBody);
      score += 1;

      // 新しいボディを作成
      currentBody = createNewShape(currentBody.position.x);
      isDropping = false;
    }
  });

  Events.on(engine, "afterUpdate", () => {
    boxes.forEach((box: any) => {
      if (box.position.y > 700) {
        clearBoxes();
        score = 0;
        currentBody = createNewShape(400);
      }
    });
  });

  Events.on(render, "afterRender", () => {
    const context = render.context;
    context.font = "20px Arial";
    context.fillStyle = "black";
    context.fillText(`Score: ${score}`, 10, 30);
  });
}
