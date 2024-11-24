import { Game } from "./matter.ts";
import { inject } from "@vercel/analytics";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>

  </div>
`;

inject();
Game();
