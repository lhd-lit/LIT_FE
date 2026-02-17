import { renameSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const distElectronPath = join(__dirname, '..', 'dist-electron');

const filesToRename = ['main.js', 'preload.js'];

filesToRename.forEach((file) => {
  const oldPath = join(distElectronPath, file);
  const newPath = join(distElectronPath, file.replace('.js', '.cjs'));
  
  if (existsSync(oldPath)) {
    renameSync(oldPath, newPath);
    console.log(`✓ Renamed ${file} to ${file.replace('.js', '.cjs')}`);
  } else {
    console.warn(`⚠ File not found: ${oldPath}`);
  }
});

