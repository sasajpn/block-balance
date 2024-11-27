import { readdir } from "node:fs/promises";
import { svgPathProperties } from "svg-path-properties";

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const svgFiles = await readdir("./src/assets/svg");
const sampleLength = 10;
const allPathVertices = await processSvgFile(svgFiles[0], sampleLength);
console.log(allPathVertices);
const jsonData = JSON.stringify(allPathVertices, null, 2);
await Bun.write("src/output.json", jsonData);

function pathToVertices(svgPath: string, sampleLength = 15) {
  const properties = new svgPathProperties(svgPath);
  const totalLength = properties.getTotalLength();
  const parts = properties.getParts();
  const points = [];

  for (const part of parts) {
    const { start, end, length } = part;
    // セグメントの始点を追加
    const startPoint = properties.getPointAtLength(start);
    points.push({ x: startPoint.x, y: startPoint.y });

    // セグメント内をサンプリング
    for (let l = start + sampleLength; l < end; l += sampleLength) {
      const point = properties.getPointAtLength(l);
      points.push({ x: point.x, y: point.y });
    }

    // セグメントの終点を追加
    const endPoint = properties.getPointAtLength(end);
    points.push({ x: endPoint.x, y: endPoint.y });
  }

  return points;
}

async function processSvgFile(filename: string, sampleLength = 15) {
  const svgFile = Bun.file(`./src/assets/svg/${filename}`);
  const svgContent = await svgFile.text();

  const dom = new JSDOM(svgContent, { contentType: "image/svg+xml" });
  const document = dom.window.document;

  const paths = Array.from(document.querySelectorAll("path"));
  const vertices = paths.map((path) => {
    const d = path.getAttribute("d");
    return pathToVertices(d, sampleLength);
  });

  return vertices;
}
