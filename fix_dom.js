const fs = require('fs');
let code = fs.readFileSync('script.js', 'utf8');
code = code.replace(/document\.addEventListener\("DOMContentLoaded", \(\) => \{/g, 'setTimeout(() => {');
fs.writeFileSync('script.js', code);
console.log('Done');
