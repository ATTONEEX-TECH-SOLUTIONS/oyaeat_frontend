const fs = require('fs');
const path = require('path');

function findEmojis(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      findEmojis(fullPath);
    } else if (stat.isFile() && fullPath.endsWith('.tsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const emojis = content.match(/\p{Emoji_Presentation}/gu);
      if (emojis) {
        console.log(`Found emojis in ${fullPath}:`, Array.from(new Set(emojis)).join(' '));
      }
    }
  }
}
findEmojis('c:\\Users\\USER\\workspace\\OYAEAT_RESTURANT\\app\\customer');
