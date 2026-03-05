// pdfIndexer.js
// Loads and indexes PDFs for rule referral

const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

const PDF_DIR = path.join(__dirname, 'rule_documents');

// Index structure: { filename: { page: text } }
const pdfIndex = {};

async function indexPDFs() {
    const files = fs.readdirSync(PDF_DIR).filter(f => f.endsWith('.pdf'));
    for (const file of files) {
        const filePath = path.join(PDF_DIR, file);
        const dataBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(dataBuffer);
        // Split text by pages (pdf-parse returns all text, so we use page markers)
        const pages = pdfData.text.split(/\n\s*Page \d+\s*\n/); // crude split, may need adjustment
        pdfIndex[file] = {};
        pages.forEach((text, i) => {
            pdfIndex[file][i + 1] = text;
        });
    }
}

function searchKeyword(keyword) {
    const results = [];
    for (const [file, pages] of Object.entries(pdfIndex)) {
        for (const [pageNum, text] of Object.entries(pages)) {
            if (text.toLowerCase().includes(keyword.toLowerCase())) {
                // Get a snippet around the keyword
                const idx = text.toLowerCase().indexOf(keyword.toLowerCase());
                const snippet = text.substring(Math.max(0, idx - 40), idx + keyword.length + 40).replace(/\n/g, ' ');
                results.push({ file, page: pageNum, snippet });
            }
        }
    }
    return results;
}

module.exports = {
    indexPDFs,
    searchKeyword
};
