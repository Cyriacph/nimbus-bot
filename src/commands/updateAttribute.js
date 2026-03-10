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
    // If attribute is a stat (strength, dexterity, etc.), update stats.<attribute>.value
    const stats = sheet.character_sheet.stats;
    if (stats && attribute in stats && typeof stats[attribute] === 'object' && 'value' in stats[attribute]) {
        let newValue = Number(value);
        if (isNaN(newValue)) {
            throw new Error('Value must be a number.');
        }
        newValue = Math.max(0, Math.min(20, newValue));
        stats[attribute].value = newValue;
        console.log(`[DEBUG] Writing updated value (${newValue}) to ${filePath}`);
        fs.writeFileSync(filePath, JSON.stringify(sheet, null, 2));
        return newValue;
    }
    // Otherwise, support nested attributes like stats.strength.value
    const pathParts = attribute.split('.');
    let target = sheet.character_sheet;
    for (let i = 0; i < pathParts.length - 1; i++) {
        if (!(pathParts[i] in target)) {
            throw new Error(`Attribute path '${pathParts[i]}' not found.`);
        }
        target = target[pathParts[i]];
    }
    const finalAttr = pathParts[pathParts.length - 1];
    if (!(finalAttr in target)) {
        throw new Error(`Attribute '${finalAttr}' not found.`);
    }
    let newValue = Number(value);
    if (isNaN(newValue)) {
        throw new Error('Value must be a number.');
    }
    newValue = Math.max(0, Math.min(20, newValue));
    target[finalAttr] = newValue;
    console.log(`[DEBUG] Writing updated value (${newValue}) to ${filePath}`);
    fs.writeFileSync(filePath, JSON.stringify(sheet, null, 2));
    return newValue;
}

module.exports = {
    updateAttribute
};
