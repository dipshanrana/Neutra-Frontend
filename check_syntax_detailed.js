const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\dipsh\\Desktop\\project1\\my-app\\app\\products\\[id]\\page.tsx', 'utf8');
const lines = content.split('\n');
let stack = [];
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const tags = line.match(/<div|<\/div/g) || [];
    for (const tag of tags) {
        if (tag === '<div') {
            stack.push(i + 1);
        } else {
            if (stack.length === 0) {
                console.log(`Extra </div> at line ${i + 1}`);
            } else {
                stack.pop();
            }
        }
    }
}
console.log(`Unclosed <div> at lines: ${stack.join(', ')}`);
