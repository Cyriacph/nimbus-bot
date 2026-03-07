// Handles storing character sheets as JSON files
const fs = require('fs');
const path = require('path');

const CHARACTER_SHEET_DIR = path.join(__dirname, '..', '..', 'character_sheets');

function storeCharacterSheet(characterName, jsonContent) {
    if (!characterName || typeof characterName !== 'string') {
        throw new Error('Character name must be a string');
    }
    const safeName = characterName.replace(/[^a-zA-Z0-9_-]/g, '_');
    const filePath = path.join(CHARACTER_SHEET_DIR, `${safeName}.json`);
    fs.writeFileSync(filePath, JSON.stringify(jsonContent, null, 2), 'utf8');
    return filePath;
}

module.exports = {
    storeCharacterSheet
};
