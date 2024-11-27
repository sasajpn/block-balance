import { readdir } from "node:fs/promises";
import sharp from "sharp";

const svgFiles = await readdir("./src/assets/svg");
const svgDir = "./src/assets/svg/";
const pngDir = "./src/assets/png/";

svgFiles.forEach((file) => {
  const pngFile = file.replace(".svg", ".png");
  sharp(`${svgDir}/${file}`).png().toFile(`${pngDir}/${pngFile}`);
});
