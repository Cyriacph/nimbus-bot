// Text Indexer utility for rule search
const fs = require('fs');
const path = require('path');


function indexJsonDictionaries(jsonDir) {
    const files = fs.readdirSync(jsonDir).filter(f => f.endsWith('.json'));
    const dictionaryIndex = {};
    for (const file of files) {
        const filePath = path.join(jsonDir, file);
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (content.dictionary && Array.isArray(content.dictionary)) {
            console.log(`[indexJsonDictionaries] Loaded file: ${filePath}, entries: ${content.dictionary.length}`);
            dictionaryIndex[file] = content.dictionary;
        } else {
            console.log(`[indexJsonDictionaries] File ${filePath} missing 'dictionary' array.`);
        }
    }
    return dictionaryIndex;
}


function escapeRegExp(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Lower rank = better match: exact name, then name contains the keyword,
// then only the definition mentions it. Matches must start at the beginning
// of a word, so "mage" finds "Mage" and "mages" but not "damage".
function matchRank(entry, lowerKeyword) {
    const word = (entry.word || '').toLowerCase();
    const startsWord = new RegExp(`(^|[^a-z0-9])${escapeRegExp(lowerKeyword)}`, 'i');
    if (word === lowerKeyword) return 0;
    if (startsWord.test(word)) return 1;
    if (startsWord.test(entry.definition || '')) return 2;
    return -1;
}

/**
 * Returns up to maxResults matches, best matches first. The returned array
 * also has a `total` property with the number of matches before the cut.
 */
function searchDictionary(dictionaryIndex, keyword, maxResults = 10) {
    const lowerKeyword = keyword.toLowerCase().trim();
    console.log(`[searchDictionary] Searching for keyword: '${keyword}'`);
    const matches = [];
    for (const [file, dictionary] of Object.entries(dictionaryIndex)) {
        console.log(`[searchDictionary] Searching in file: ${file}, entries: ${dictionary.length}`);
        for (const entry of dictionary) {
            const rank = matchRank(entry, lowerKeyword);
            if (rank !== -1) {
                matches.push({ rank, file, word: entry.word, definition: entry.definition });
            }
        }
    }
    // Array.prototype.sort is stable, so equal ranks keep their file order.
    matches.sort((a, b) => a.rank - b.rank);
    const results = matches.slice(0, maxResults).map(({ rank, ...rest }) => rest);
    results.total = matches.length;
    console.log(`[searchDictionary] Results found: ${matches.length}`);
    return results;
}

/**
 * Builds the Discord reply for !search, staying under Discord's
 * 2000-character message limit.
 */
function formatSearchReply(keyword, results, maxLength = 2000) {
    const total = results.total ?? results.length;
    const header = `Found ${total} result(s) for "${keyword}":`;
    const lines = [header];
    let length = header.length;
    let shown = 0;
    for (const r of results) {
        const line = `**${r.word}**: ${r.definition}`;
        // Keep room for the "...more" footer.
        if (length + 1 + line.length > maxLength - 80) break;
        lines.push(line);
        length += 1 + line.length;
        shown++;
    }
    if (shown < total) {
        lines.push(`...and ${total - shown} more. Try a more specific search.`);
    }
    return lines.join('\n');
}

module.exports = { indexJsonDictionaries, searchDictionary, formatSearchReply };
