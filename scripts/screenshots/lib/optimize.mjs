import sharp from 'sharp';
import { outPath } from './utils.mjs';

const WIDTH = 800;
const HEIGHT = 320;

export async function optimizeImage(rawPng, slug) {
  const dest = outPath(slug);
  await sharp(rawPng)
    .resize(WIDTH, HEIGHT, { fit: 'cover', position: 'centre' })
    .webp({ quality: 80 })
    .toFile(dest);
  return dest;
}

export async function optimizePlot(sourcePath, slug) {
  return optimizeImage(sourcePath, slug);
}
