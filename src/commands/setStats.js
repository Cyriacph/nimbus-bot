// Updates a character's stat (no bounds)
const fs = require('fs');
const path = require('path');

const CHARACTER_SHEET_DIR = path.join(__dirname, '..', '..', 'character_sheets');

function setStats(characterName, stat, value) {
    if (!characterName || !stat || value === undefined) {
        throw new Error('Character name, stat, and value are required');
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
    const stats = sheet.character_sheet.stats;
    if (stats && stat in stats && typeof stats[stat] === 'object' && 'value' in stats[stat]) {
        stats[stat].value = Number(value);
        console.log(`[DEBUG] Writing updated value (${value}) to ${filePath}`);
        fs.writeFileSync(filePath, JSON.stringify(sheet, null, 2));
        return value;
    }
    throw new Error(`Stat '${stat}' not found.`);
}

module.exports = {
    setStats
};
