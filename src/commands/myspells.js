/**
 * !myspells command: Returns all spells a character has access to, if any.
 * Usage :  !myspells <characterName>
 * 
 */

const { fetchCharacterSheet } = require('./fetchSheet');
const fs = require('fs');

function mySpells(characterName) {
    // fetchCharacterSheet returns the file path
    const filePath = fetchCharacterSheet(characterName);
    
    // Read and parse the JSON file to get the actual sheet object
    const sheetData = fs.readFileSync(filePath, 'utf8');
    const sheetJSON = JSON.parse(sheetData);
    const spells = sheetJSON.spells;

    if (spells && spells.length > 0) {
        return spells.map((s) => '- ' + s.name).join('\n');
    } else {
        return null; // No spells found for the character
    }
}

module.exports = {
    mySpells
}