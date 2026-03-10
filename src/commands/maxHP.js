/** 
 * Update character's max HP. Bot returns new max HP value.
 * 
 * Usage: !maxHP [characterName] [value]
 */

const { fetchCharacterSheet} = require('./fetchSheet');
const { storeCharacterSheet } = require('./storeSheet');
const fs = require('fs');


function maxHP(characterName, value) {
    // fetchCharacterSheet returns the file path
    const filePath = fetchCharacterSheet(characterName);
        
    // Read and parse the JSON file to get the actual sheet object
    const sheetData = fs.readFileSync(filePath, 'utf8');
    const sheetJSON = JSON.parse(sheetData);
    const sheet = sheetJSON.character_sheet;

    sheet.hit_points.max = value;
    if (sheet.hit_points.current > value) {
        sheet.hit_points.current = value;
    }

    storeCharacterSheet(characterName, sheetJSON);
    return sheet.hit_points.max;
}

module.exports = {
    maxHP
}