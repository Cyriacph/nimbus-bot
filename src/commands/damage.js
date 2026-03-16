/**
 * !damage command: Damages a player by a specified amount.
 * Usage: !damage <characterName> <amount>
 */

const { fetchCharacterSheet} = require('./fetchSheet');
const { storeCharacterSheet } = require('./storeSheet');
const fs = require('fs');

// Returns the new hp value after damage is applied, or -1 if character is already dying (0hp)
function damage(characterName, amount) {
    // fetchCharacterSheet returns the file path
    const filePath = fetchCharacterSheet(characterName);
    
    // Read and parse the JSON file to get the actual sheet object
    const sheetData = fs.readFileSync(filePath, 'utf8');
    const sheetJSON = JSON.parse(sheetData);
    const sheet = sheetJSON.character_sheet;
    
    const currentHP = sheet.hit_points.current;
    const maxHP = sheet.hit_points.max;
    const tempHP = sheet.hit_points.temp_hp || 0;

    if (currentHP + tempHP > 0) {
        if (tempHP > 0) {
            // If temp HP is being reduced, it should be reduced first
            const tempHPReduction = Math.min(tempHP, amount);
            sheet.hit_points.temp_hp -= tempHPReduction;
            amount -= tempHPReduction; // Reduce the amount to subtract from current HP
        }
        let newHP = currentHP - amount;
        if (newHP <= 0) {
            newHP = 0;
            //TODO: Mark character as DYING
        }
        sheet.hit_points.current = newHP;

        storeCharacterSheet(characterName, sheetJSON);
        
        return newHP;
    }
    return -1; // Character is already at 0 HP, cannot be damaged further
}

module.exports = {
    damage
}