/**
 * Rebuilds public/appLogo.ico from public/appLogo.png.
 * Uses png-to-ico (BMP/DIB layers) — avoids broken neon-green icons on Windows
 * that palette-PNG + to-ico can produce.
 *
 * Run: npm run generate:ico
 */
const fs = require("fs");
const path = require("path");
const pngToIco = require("png-to-ico");

const root = path.join(__dirname, "..");
const pngPath = path.join(root, "public", "appLogo.png");
const icoPath = path.join(root, "public", "appLogo.ico");

pngToIco(pngPath)
  .then((buf) => {
    fs.writeFileSync(icoPath, buf);
    console.log("Wrote", icoPath, `(${buf.length} bytes)`);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
