import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';

export const copyDir = async (src: string, dest: string) => {
  // if (existsSync(src) == false) {
  //   //make directory
  //   mkdirSync(src, { recursive: true });
  // }

  try {
    await mkdirSync(dest, { recursive: true });
    const entries = readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = join(src, entry.name);
      const destPath = join(dest, entry.name);
      entry.isDirectory()
        ? await copyDir(srcPath, destPath)
        : await copyFileSync(srcPath, destPath);
    }
  } catch (error) {
    throw error;
  }
};
