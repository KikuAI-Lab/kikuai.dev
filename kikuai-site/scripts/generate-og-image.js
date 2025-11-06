import sharp from 'sharp';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const svgPath = join(rootDir, 'public', 'og-image.svg');
const pngPath = join(rootDir, 'public', 'og-image.png');

const svgBuffer = readFileSync(svgPath);

sharp(svgBuffer)
  .resize(1200, 630, {
    fit: 'contain',
    background: { r: 10, g: 10, b: 10, alpha: 1 }
  })
  .png()
  .toFile(pngPath)
  .then(() => {
    console.log('✅ og-image.png generated successfully');
  })
  .catch((err) => {
    console.error('❌ Error generating og-image.png:', err);
    process.exit(1);
  });

