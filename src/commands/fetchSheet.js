// Handles fetching character sheet JSON files
const fs = require('fs');
const path = require('path');

const CHARACTER_SHEET_DIR = path.join(__dirname, '..', '..', 'character_sheets');

function fetchCharacterSheet(characterName) {
    if (!characterName || typeof characterName !== 'string') {
        throw new Error('Character name must be a string');
    }
    const safeName = characterName.replace(/[^a-zA-Z0-9_-]/g, '_');
    const filePath = path.join(CHARACTER_SHEET_DIR, `${safeName}.json`);
    if (!fs.existsSync(filePath)) {
        throw new Error(`No character sheet found for '${characterName}'.`);
    }
    return filePath;
}

module.exports = {
    fetchCharacterSheet
};
