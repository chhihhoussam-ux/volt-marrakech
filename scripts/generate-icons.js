const fs = require('fs');

// SVG source pour l'icône
const svgIcon = (size) => `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#0a0a0a"/>
  <text x="50%" y="54%" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="${size * 0.55}" font-weight="500" fill="#C8FF00" text-anchor="middle" dominant-baseline="middle">V</text>
</svg>`;

fs.writeFileSync('public/icon-192.svg', svgIcon(192));
fs.writeFileSync('public/icon-512.svg', svgIcon(512));
console.log('SVG icons created');
