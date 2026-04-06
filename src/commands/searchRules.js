P// pdfIndexer.js
// Loads and indexes PDFs for rule referral

// This file should now use the PDF indexing/search logic from src/utils/pdfIndexer.js
const {
  SEARCH_COMMAND,
  SEARCH_USAGE,
  MAX_SEARCH_RESULTS,
  SNIPPET_RADIUS,
} = require("../constants/search");
const path = require("path");

const JSON_DIR = path.join(
  __dirname,
  "..",
  "..",
  "rule_documents",
  "text_documents",
);
const textIndexer = require("../utils/textIndexer");

let dictionaryIndex = {};

function indexJsonDictionaries() {
  dictionaryIndex = textIndexer.indexJsonDictionaries(JSON_DIR);
}

function searchDictionary(keyword) {
  return textIndexer.searchDictionary(
    dictionaryIndex,
    keyword,
    MAX_SEARCH_RESULTS,
  );
}

module.exports = {
  indexJsonDictionaries,
  searchDictionary,
};
