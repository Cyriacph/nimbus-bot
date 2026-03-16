/**
 * !heal command: Heals a player for a chosen (strictly poritive) amount, if player is DYING (0hp) remove the status
 * Usage: !heal <characterName> <amount>
 */

const { fetchCharacterSheet } = require('./fetchSheet');
const { storeCharacterSheet } = require('./storeSheet');
const fs = require('fs');

function heal(characterName, amount) {
    // fetchCharacterSheet returns the file path
    const filePath = fetchCharacterSheet(characterName);
    
    // Read and parse the JSON file to get the actual sheet object
    const sheetData = fs.readFileSync(filePath, 'utf8');
    const sheetJSON = JSON.parse(sheetData);
    const sheet = sheetJSON.character_sheet;
    
    const currentHP = sheet.hit_points.current;
    const maxHP = sheet.hit_points.max;

    if (currentHP === 0 && amount > 0) {
        //TODO: Remove DYING status
    }
    let newHP = currentHP + amount;
    if (newHP > maxHP) {
        newHP = maxHP;
    }
    sheet.hit_points.current = newHP;

    storeCharacterSheet(characterName, sheetJSON);

    return newHP;
}

module.exports = {
    heal
}