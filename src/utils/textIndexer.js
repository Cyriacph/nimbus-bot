// Text Indexer utility for rule search
const fs = require('fs');
const path = require('path');

function indexTextFiles(txtDir) {
    const files = fs.readdirSync(txtDir).filter(f => f.endsWith('.txt'));
    const textIndex = {};
    for (const file of files) {
        const filePath = path.join(txtDir, file);
        textIndex[file] = fs.readFileSync(filePath, 'utf8');
    }
    return textIndex;
}

function searchKeyword(textIndex, keyword, snippetRadius = 40, maxResults = 10) {
    const results = [];
    for (const [file, text] of Object.entries(textIndex)) {
        let idx = text.toLowerCase().indexOf(keyword.toLowerCase());
        while (idx !== -1 && results.length < maxResults) {
            const snippet = text.substring(Math.max(0, idx - snippetRadius), idx + keyword.length + snippetRadius).replace(/\n/g, ' ');
            results.push({ file, snippet });
            idx = text.toLowerCase().indexOf(keyword.toLowerCase(), idx + keyword.length);
        }
    }
    return results;
}

module.exports = { indexTextFiles, searchKeyword };
