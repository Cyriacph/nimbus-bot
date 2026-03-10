// Increment the bonus of a chosen skill for a defined character
const fs = require('fs');
const path = require('path');

const CHARACTER_SHEET_DIR = path.join(__dirname, '..', '..', 'character_sheets');

function upskill(characterName, skillName) {
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
    if (!skills || !(skillName in skills)) {
        throw new Error(`Skill '${skillName}' not found.`);
    }
    skills[skillName].bonus = (skills[skillName].bonus ?? 0) + 1;
    fs.writeFileSync(filePath, JSON.stringify(sheet, null, 2));
    return skills[skillName].bonus;
}

module.exports = {
    upskill
};
