// One-off: build src/app/favicon.ico from the fish emblem in public/logo.png.
// Crops the emblem (top portion of the wordmark, dropping the text), trims the
// transparent border, pads it to a square, then packs PNG-encoded sizes into an .ico.
import sharp from "sharp";
import { writeFile } from "node:fs/promises";

const SRC = "public/logo.png";
const OUT = "src/app/favicon.ico";
const SIZES = [16, 32, 48, 64, 128, 256];

const meta = await sharp(SRC).metadata();

// The emblem sits in the top ~72% of the logo; the "SERENDIB PRIME" text is below.
// (trim() must run on a materialized buffer, not chained after extract().)
const cropped = await sharp(SRC)
  .extract({ left: 0, top: 0, width: meta.width, height: Math.round(meta.height * 0.72) })
  .png()
  .toBuffer();
const emblem = await sharp(cropped)
  .trim({ background: "#00000000", threshold: 10 })
  .toBuffer({ resolveWithObject: true });

// Pad to a square with a small transparent margin so it isn't edge-to-edge.
const longest = Math.max(emblem.info.width, emblem.info.height);
const square = Math.round(longest / 0.86);
const padded = await sharp({
  create: { width: square, height: square, channels: 4, background: "#00000000" },
})
  .composite([
    {
      input: emblem.data,
      left: Math.round((square - emblem.info.width) / 2),
      top: Math.round((square - emblem.info.height) / 2),
    },
  ])
  .png()
  .toBuffer();

const pngs = await Promise.all(
  SIZES.map((s) => sharp(padded).resize(s, s, { kernel: "lanczos3" }).png({ compressionLevel: 9 }).toBuffer())
);

// Assemble the ICO (PNG-in-ICO format).
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(SIZES.length, 4); // image count

const entries = [];
let offset = 6 + SIZES.length * 16;
for (let i = 0; i < SIZES.length; i++) {
  const e = Buffer.alloc(16);
  e.writeUInt8(SIZES[i] >= 256 ? 0 : SIZES[i], 0); // width (0 = 256)
  e.writeUInt8(SIZES[i] >= 256 ? 0 : SIZES[i], 1); // height
  e.writeUInt8(0, 2); // palette
  e.writeUInt8(0, 3); // reserved
  e.writeUInt16LE(1, 4); // color planes
  e.writeUInt16LE(32, 6); // bits per pixel
  e.writeUInt32LE(pngs[i].length, 8); // size of PNG data
  e.writeUInt32LE(offset, 12); // offset of PNG data
  offset += pngs[i].length;
  entries.push(e);
}

await writeFile(OUT, Buffer.concat([header, ...entries, ...pngs]));
console.log(`wrote ${OUT} with sizes ${SIZES.join(", ")} (${offset} bytes)`);
