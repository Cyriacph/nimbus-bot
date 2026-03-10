// Updates a character's attribute, clamped between 0 and 20
const fs = require('fs');
const path = require('path');

const CHARACTER_SHEET_DIR = path.join(__dirname, '..', '..', 'character_sheets');

function updateAttribute(characterName, attribute, value) {
    if (!characterName || !attribute || value === undefined) {
        throw new Error('Character name, attribute, and value are required');
    }
    const safeName = characterName.replace(/[^a-zA-Z0-9_-]/g, '_');
    const filePath = path.join(CHARACTER_SHEET_DIR, `${safeName}.json`);
    if (!fs.existsSync(filePath)) {
        throw new Error(`No character sheet found for '${characterName}'.`);
    }
    const sheet = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (!sheet.character_sheet || typeof sheet.character_sheet !== 'object') {
        throw new Error('Invalid character sheet format.');
    }
    if (!(attribute in sheet.character_sheet)) {
        throw new Error(`Attribute '${attribute}' not found in character sheet.`);
    }
    let newValue = Number(value);
    if (isNaN(newValue)) {
        throw new Error('Value must be a number.');
    }
    newValue = Math.max(0, Math.min(20, newValue));
    sheet.character_sheet[attribute] = newValue;
    fs.writeFileSync(filePath, JSON.stringify(sheet, null, 2));
    return newValue;
}

module.exports = {
    updateAttribute
};
