import fs from 'fs';
import path from 'path';

import archiver from 'archiver';

export async function createZip(destination: string, files: string[], baseDir: string) {
  const output = fs.createWriteStream(destination);
  const archive = archiver('zip', { zlib: { level: 9 } });

  return new Promise<void>((resolve, reject) => {
    archive.on('error', reject);
    output.on('close', resolve);
    archive.pipe(output);

    for (const file of files) {
      const relativePath = path.relative(baseDir, file);
      archive.file(file, { name: relativePath });
    }

    archive.finalize();
  });
}
