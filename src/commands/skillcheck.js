// Rolls skill check for user (not attribute)
// Usage: !skillcheck [characterName] [skillName]

const fs = require('fs');
const path = require('path');

const CHARACTER_SHEET_DIR = path.join(__dirname, '..', '..', 'character_sheets');

function skillCheck(characterName, skillName) {
    if (!characterName || !skillName) {
        throw new Error('Character name and skill name are required');
    }
    const safeName = characterName.replace(/[^a-zA-Z0-9_-]/g, '_');
    const filePath = path.join(CHARACTER_SHEET_DIR, `${safeName}.json`);
    if (!fs.existsSync(filePath)) {
        throw new Error(`No character sheet found for '${characterName}'.`);
    }
    const sheet = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const skills = sheet.character_sheet.skills;
    if (!skills || typeof skills !== 'object') {
        throw new Error('No skills found in character sheet.');
    }
    if (!(skillName in skills)) {
        throw new Error(`Skill '${skillName}' not found.`);
    }
    const skillObj = skills[skillName];
    const statName = skillObj.base;
    const statValue = sheet.character_sheet.stats[statName]?.value ?? 0;
    const bonus = skillObj.bonus ?? 0;
    const skillValue = statValue + bonus;
    // Roll 1d20 + skillValue
    const roll = Math.floor(Math.random() * 20) + 1;
    const total = roll + skillValue;
    return {
        roll,
        skillValue,
        total
    };
}

module.exports = {
    skillCheck
};
