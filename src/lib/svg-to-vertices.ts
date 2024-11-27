import Matter from "matter-js";
import "pathseg";

export async function svgToVertives() {
  const svgs = import.meta.glob("../assets/svg/*");

  const verticesMap = {};
  for (const [path, resolver] of Object.entries(svgs)) {
    const module = await resolver();
    const fileName = path.split("/").pop();

    const response = await fetch(module.default);
    const svgText = await response.text();

    const parser = new DOMParser();
    const svgDocument = parser.parseFromString(svgText, "image/svg+xml");
    const paths = svgDocument.querySelectorAll("path");

    const vertices = Array.from(paths).map((path) => {
      return Matter.Svg.pathToVertices(path, 10);
    });

    verticesMap[fileName] = vertices;
  }

  const json = JSON.stringify(verticesMap, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "vertices.json";
  a.click();

  URL.revokeObjectURL(url);
}
