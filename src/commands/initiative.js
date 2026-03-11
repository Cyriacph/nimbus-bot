/**
 * Rolls initiative for character (1d20 + dexterity).
 * Usage: !initiative [characterName] 
 */

const { roll } = require('./rollDice');
const { fetchCharacterSheet} = require('./fetchSheet');
const fs = require('fs');

function initiative(characterName) {

    const filePath = fetchCharacterSheet(characterName);
    const sheetData = fs.readFileSync(filePath, 'utf8');
    const sheetJSON = JSON.parse(sheetData);
    const sheet = sheetJSON.character_sheet;

    const dexterity = sheet.stats.dexterity.value;
    const initiativeRoll = roll('1d20+' + dexterity);

    return initiativeRoll;
}

module.exports = {
    initiative
}