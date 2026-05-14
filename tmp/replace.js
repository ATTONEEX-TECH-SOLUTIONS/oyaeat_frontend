const fs = require('fs');
const path = require('path');

const directoryPath = 'c:/Users/USER/workspace/OYAEAT_RESTURANT/app';

const replacers = [
  { regex: /bg-\[#F5FAF6\]/g, replacement: 'bg-background' },
  { regex: /bg-white/g, replacement: 'bg-card' },
  { regex: /text-\[#111C14\]/g, replacement: 'text-foreground' },
  { regex: /text-\[#4a7c59\]/g, replacement: 'text-primary' },
  { regex: /text-\[#6B7C6E\]/g, replacement: 'text-muted-foreground' },
  { regex: /border-\[#D8E4DC\]/g, replacement: 'border-border' },
  { regex: /bg-\[#1a5c2a\]/g, replacement: 'bg-primary' },
  { regex: /#F5FAF6/g, replacement: 'transparent' }, // Some inline styles
  { regex: /#111C14/g, replacement: 'inherit' } // Some inline styles
];

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;
            
            replacers.forEach(r => {
                content = content.replace(r.regex, r.replacement);
            });
            
            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated ${fullPath}`);
            }
        }
    });
}

processDirectory(directoryPath);
