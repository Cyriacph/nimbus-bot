/**
 * Updates character's current health point, incrementally (by adding or subtracting to original value. Bot returns new health points value.

 * Usage: !updateHP [characterName] [value]
 */

// get character sheet, update HP, save character sheet, return new HP value

const { fetchCharacterSheet } = require('./fetchSheet');
const { storeCharacterSheet } = require('./storeSheet');
const fs = require('fs');

function addHP(characterName, value) {
    // fetchCharacterSheet returns the file path
    const filePath = fetchCharacterSheet(characterName);
    
    // Read and parse the JSON file to get the actual sheet object
    const sheetData = fs.readFileSync(filePath, 'utf8');
    const sheetJSON = JSON.parse(sheetData);
    const sheet = sheetJSON.character_sheet;
    
    const currentHP = sheet.hit_points.current;
    const maxHP = sheet.hit_points.max;
    const tempHP = sheet.hit_points.temp_hp || 0;

    if (tempHP > 0 && value < 0) {
        // If temp HP is being reduced, it should be reduced first
        const tempHPReduction = Math.min(tempHP, -value);
        sheet.hit_points.temp_hp -= tempHPReduction;
        value += tempHPReduction; // Reduce the value to subtract from current HP
    }
    let newHP = currentHP + value;
    if (newHP > maxHP) {
        newHP = maxHP;
    }
    if (newHP < 0) {
        newHP = 0;
    }
    sheet.hit_points.current = newHP;
    
    storeCharacterSheet(characterName, sheetJSON);
    return newHP;
}


module.exports = {
    addHP
}

