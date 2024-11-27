import { Game } from "./matter.ts";
import { inject } from "@vercel/analytics";
// import { svgToVertives } from "./lib/svg-to-vertices.ts";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>

  </div>
`;

inject();
Game();
// svgToVertives();
