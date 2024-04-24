import fs from "fs";
import packageJson from "../package.json" assert { type: "json" };

const max = packageJson.distFileSizes.maxSizeKB;
const size = fs.statSync("./dist/space-bacteria.umd.cjs").size / 1000;

if (size > max) {
  throw new Error("File size exceeded!");
}

console.info("File size ok!");
