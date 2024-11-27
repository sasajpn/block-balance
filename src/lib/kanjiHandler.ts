import kanjiJson from "../assets/vertices.json";
import pngFiles from "../assets/png";

import type { VerticesData } from "../types";

const verticesData: VerticesData = kanjiJson;
const verticesKeys = Object.keys(verticesData);

export function getKanjiData() {
  const index = Math.floor(Math.random() * verticesKeys.length);
  const verticesKey = verticesKeys[index];
  const verticesValue = verticesData[verticesKey];
  const pngFileName = verticesKey.replace(".svg", ".png");
  const pngFileModule = pngFiles[pngFileName];
  const pngFile = pngFileModule?.default;

  return { verticesValue, pngFile };
}
