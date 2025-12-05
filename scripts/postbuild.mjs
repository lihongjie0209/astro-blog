import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const source = path.join(__dirname, '../dist/pagefind');
const destination = path.join(__dirname, '../public/pagefind');

async function copyDir(src, dest) {
    try {
        await fs.promises.rm(dest, { recursive: true, force: true });
        await fs.promises.mkdir(dest, { recursive: true });
        let entries = await fs.promises.readdir(src, { withFileTypes: true });

        for (let entry of entries) {
            let srcPath = path.join(src, entry.name);
            let destPath = path.join(dest, entry.name);

            entry.isDirectory() ?
                await copyDir(srcPath, destPath) :
                await fs.promises.copyFile(srcPath, destPath);
        }
        console.log(`Successfully copied ${src} to ${dest}`);
    } catch (err) {
        console.error('Error copying directory:', err);
        process.exit(1);
    }
}

copyDir(source, destination);
