const fs = require('fs');
const path = require('path');

const BRAIN = 'C:/Users/Alex/.gemini/antigravity/brain/f6daef26-595c-4c5c-b117-14593848c8c3';

const images = [
    { src: 'faction_bg_dominion_1772204150152.png', dest: 'faction-bg-dominion.png' },
    { src: 'faction_bg_accord_1772204168249.png', dest: 'faction-bg-accord.png' },
    { src: 'faction_bg_veil_1772204182029.png', dest: 'faction-bg-veil.png' },
    { src: 'faction_bg_covenant_1772204199155.png', dest: 'faction-bg-covenant.png' }
];

const targetDir = path.join(__dirname, 'Images', 'generated');

// Create the directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

console.log('Copying images...');

images.forEach(img => {
    const srcPath = path.join(BRAIN, img.src);
    const destPath = path.join(targetDir, img.dest);

    if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`Copied ${img.dest} successfully!`);
    } else {
        console.log(`❌ Source image ${srcPath} NOT FOUND!`);
    }
});

console.log('Done!');
