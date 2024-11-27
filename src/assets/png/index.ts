const pngFiles = import.meta.glob("./*.png", { eager: true });

export default Object.keys(pngFiles).reduce((acc, filePath) => {
  const fileName = filePath.split("/").pop();
  if (fileName) {
    acc[fileName] = pngFiles[filePath];
  }
  return acc;
}, {} as Record<string, any>);
