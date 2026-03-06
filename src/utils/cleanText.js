// Utility to clean text files for bot search
const fs = require('fs');
const path = require('path');

function cleanTextFile(inputPath, outputPath) {
    let text = fs.readFileSync(inputPath, 'utf8');
    // Remove non-printable and undefined characters
    text = text.replace(/[^\x20-\x7E\n]/g, '');
    // Normalize whitespace
    text = text.replace(/\s+/g, ' ');
    // Optionally, add extra line breaks after section headers (e.g., all-caps lines)
    text = text.replace(/(\n[A-Z ]{5,}\n)/g, '\n$1\n');
    fs.writeFileSync(outputPath, text, 'utf8');
}

function cleanAllTextFiles(txtDir) {
    const files = fs.readdirSync(txtDir).filter(f => f.endsWith('.txt'));
    for (const file of files) {
        const inputPath = path.join(txtDir, file);
        const outputPath = path.join(txtDir, 'clean_' + file);
        cleanTextFile(inputPath, outputPath);
    }
}

module.exports = { cleanTextFile, cleanAllTextFiles };
