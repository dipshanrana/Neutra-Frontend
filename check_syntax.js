const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\dipsh\\Desktop\\project1\\my-app\\app\\products\\[id]\\page.tsx', 'utf8');
let openCount = 0;
let closeCount = 0;
for (let i = 0; i < content.length; i++) {
    if (content[i] === '{') openCount++;
    if (content[i] === '}') closeCount++;
}
console.log(`Braces: { = ${openCount}, } = ${closeCount}`);
let openP = 0;
let closeP = 0;
for (let i = 0; i < content.length; i++) {
    if (content[i] === '(') openP++;
    if (content[i] === ')') closeP++;
}
console.log(`Parentheses: ( = ${openP}, ) = ${closeP}`);
let openD = 0;
let closeD = 0;
const divs = content.match(/<div/g) || [];
const closedivs = content.match(/<\/div/g) || [];
console.log(`Divs: <div = ${divs.length}, </div> = ${closedivs.length}`);
