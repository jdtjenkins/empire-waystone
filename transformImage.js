import sharp from "sharp";
import { join } from "node:path"
import { mkdirSync } from 'node:fs';

/**
 * Splits an image into 256x256 tiles and saves them to a directory.
 * @param {string} inputPath - Path to the input image file.
 * @param {string} outputDir - Directory to save the tiles into.
 * @param {number} tileSize - Size of each tile (default 256).
 */
async function splitImageToTiles(inputPath, outputDir, z, tileSize = 256) {
  const image = sharp(inputPath);
  const metadata = await image.metadata();
  const { width, height } = metadata;

  const cols = Math.ceil(width / tileSize);
  const rows = Math.ceil(height / tileSize);

  mkdirSync(outputDir, { recursive: true });

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const left = x * tileSize;
      const top = y * tileSize;

      const tile = image.clone().extract({
        left,
        top,
        width: Math.min(tileSize, width - left),
        height: Math.min(tileSize, height - top),
      });

      const filename = join(outputDir, `tile_${x}_${y}_${z}.png`);
      await tile.png().toFile(filename);
    }
  }

  console.log(`✅ Tiled image into ${cols * rows} tiles in "${outputDir}"`);
}

const [input, output, z = 0] = process.argv.slice(2);

if (!input || !output) {
    console.error('Usage: node transformImage.js <inputImage> <outputDirectory>');
    process.exit(1);
}

splitImageToTiles(input, output, z).catch(err => {
    console.error('Error:', err);
    process.exit(1);
});

