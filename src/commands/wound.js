/**
 * !wound command: Inflicts a number of wound on a player, if the player suffers at least 6 wounds, mark it as dead.
 * Usage: !wound <characterName> <amount>
 */

const { fetchCharacterSheet} = require('./fetchSheet');
const { storeCharacterSheet } = require('./storeSheet');
const fs = require('fs');

// Returns current wound count after applying wounds, or -1 if character is already dead (6 wounds)
function wound(characterName, amount) {
    // fetchCharacterSheet returns the file path
    const filePath = fetchCharacterSheet(characterName);
    
    // Read and parse the JSON file to get the actual sheet object
    const sheetData = fs.readFileSync(filePath, 'utf8');
    const sheetJSON = JSON.parse(sheetData);
    const sheet = sheetJSON.character_sheet;
    
    const currentWounds = sheet.wounds.current;
    const maxWounds = sheet.wounds.max;
    if (currentWounds < maxWounds) {
        let newWounds = currentWounds + amount;
        if (newWounds > 6) {
            newWounds = 6;
            //TODO: Mark character as dead
        }
        sheet.wounds.current = newWounds;

        storeCharacterSheet(characterName, sheetJSON);

        return newWounds;
    }
    return -1; // Character is already at max wounds
}

module.exports = {
    wound
}