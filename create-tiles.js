import { createCanvas } from '@napi-rs/canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'node:url';

const TILE_SIZE = 256;
const GRID_SIZE = 10; // 10x10 grid = 100 tiles
const OUTPUT_DIR = path.join(path.resolve(fileURLToPath(import.meta.url), "../"), 'tiles');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR)
}

(async () => {
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const canvas = createCanvas(TILE_SIZE, TILE_SIZE);
      const ctx = canvas.getContext('2d');

      // Background
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);

      // Border
      ctx.strokeStyle = '#ccc';
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, TILE_SIZE, TILE_SIZE);

      // Draw the coordinate text
      ctx.fillStyle = '#333';
      ctx.font = 'bold 30px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`(${x}, ${y})`, TILE_SIZE / 2, TILE_SIZE / 2);

      // Save to file
      const filename = path.join(OUTPUT_DIR, `tile_${x}_${y}_0.png`);
      const buffer = canvas.toBuffer('image/png');
      fs.writeFileSync(filename, buffer);
    }
  }

  console.log('✅ 100 tiles generated in ./tiles');
})();