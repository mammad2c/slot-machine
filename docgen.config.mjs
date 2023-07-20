import path from "path";

export default {
  components: "src/components/**/*.vue",
  getDocFileName: (filePath) => filePath.replace(/\.vue$/, ".md"),
  getDestFile: (filePath) => {
    const fileName = path.basename(filePath);
    return path.join(filePath).replace(fileName, "README.md"); // specify the name of the output md file
  },
};
