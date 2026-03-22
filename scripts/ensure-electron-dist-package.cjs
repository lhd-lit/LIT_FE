/**
 * Root package.json has "type": "module", so plain .js under dist-electron would be ESM.
 * Emit a local package.json so tsc output (main.js, preload.js) runs as CommonJS.
 */
const fs = require("fs");
const path = require("path");

const distElectron = path.join(__dirname, "..", "dist-electron");
const pkgPath = path.join(distElectron, "package.json");

fs.mkdirSync(distElectron, { recursive: true });
fs.writeFileSync(pkgPath, JSON.stringify({ type: "commonjs" }, null, 2) + "\n");
console.log("✓ Wrote", pkgPath);
