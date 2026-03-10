// Utility functions for character sheet operations
const fs = require('fs');
const path = require('path');

const CHARACTER_SHEET_DIR = path.join(__dirname, '..', '..', 'character_sheets');

function safeName(name) {
    return name.replace(/[^a-zA-Z0-9_-]/g, '_');
}

function getSheetPath(characterName) {
    return path.join(CHARACTER_SHEET_DIR, `${safeName(characterName)}.json`);
}

function loadCharacterSheet(characterName) {
    const filePath = getSheetPath(characterName);
    if (!fs.existsSync(filePath)) {
        throw new Error(`No character sheet found for '${characterName}'.`);
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

module.exports = {
    safeName,
    getSheetPath,
    loadCharacterSheet
};
