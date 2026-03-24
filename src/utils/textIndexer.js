// Text Indexer utility for rule search
const fs = require("fs");
const path = require("path");

function indexJsonDictionaries(jsonDir) {
  const files = fs.readdirSync(jsonDir).filter((f) => f.endsWith(".json"));
  const dictionaryIndex = {};
  for (const file of files) {
    const filePath = path.join(jsonDir, file);
    const content = JSON.parse(fs.readFileSync(filePath, "utf8"));
    if (content.dictionary && Array.isArray(content.dictionary)) {
      console.log(
        `[indexJsonDictionaries] Loaded file: ${filePath}, entries: ${content.dictionary.length}`,
      );
      dictionaryIndex[file] = content.dictionary;
    } else {
      console.log(
        `[indexJsonDictionaries] File ${filePath} missing 'dictionary' array.`,
      );
    }
  }
  return dictionaryIndex;
}

function searchDictionary(dictionaryIndex, keyword, maxResults = 10) {
  const results = [];
  const lowerKeyword = keyword.toLowerCase();
  console.log(`[searchDictionary] Searching for keyword: '${keyword}'`);
  for (const [file, dictionary] of Object.entries(dictionaryIndex)) {
    console.log(
      `[searchDictionary] Searching in file: ${file}, entries: ${dictionary.length}`,
    );
    for (const entry of dictionary) {
      if (
        (entry.word && entry.word.toLowerCase().includes(lowerKeyword)) ||
        (entry.definition &&
          entry.definition.toLowerCase().includes(lowerKeyword))
      ) {
        results.push({ file, word: entry.word, definition: entry.definition });
        if (results.length >= maxResults) break;
      }
    }
  }
  console.log(`[searchDictionary] Results found: ${results.length}`);
  return results;
}

module.exports = { indexJsonDictionaries, searchDictionary };
module.exports = { indexJsonDictionaries, searchDictionary };
