import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const dir = path.join(process.cwd(), 'public', 'textures');
const files = fs.readdirSync(dir);

for (const file of files) {
  if (file.endsWith('.png')) {
    const input = path.join(dir, file);
    const output = path.join(dir, file.replace('.png', '.webp'));
    try {
      await sharp(input).webp({ quality: 80 }).toFile(output);
      console.log(`Converted ${file}`);
      fs.unlinkSync(input);
    } catch (e) {
      console.error(`Failed ${file}:`, e);
    }
  }
}
