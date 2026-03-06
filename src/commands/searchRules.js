// pdfIndexer.js
// Loads and indexes PDFs for rule referral

// This file should now use the PDF indexing/search logic from src/utils/pdfIndexer.js
const { SEARCH_COMMAND, SEARCH_USAGE, MAX_SEARCH_RESULTS, SNIPPET_RADIUS } = require('../constants/search');
const path = require('path');
const TXT_DIR = path.join(__dirname, '..', '..', 'rule_documents', 'text_documents');
const textIndexer = require('../utils/textIndexer');

let textIndex = {};

function indexTextFiles() {
    textIndex = textIndexer.indexTextFiles(TXT_DIR);
}

function searchKeyword(keyword) {
    return textIndexer.searchKeyword(textIndex, keyword, SNIPPET_RADIUS, MAX_SEARCH_RESULTS);
}

module.exports = {
    indexTextFiles,
    searchKeyword
};
