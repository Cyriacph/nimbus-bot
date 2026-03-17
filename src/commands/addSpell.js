// addSpell.js
// Command to add a spell to a character sheet by name, copying the spell's description from spellbook.json

const fs = require('fs');
const path = require('path');

const SPELLBOOK_PATH = path.join(__dirname, '../../rule_documents/text_documents/spellbook.json');
const SHEETS_DIR = path.join(__dirname, '../../character_sheets/');

module.exports = {
  name: 'addSpell',
  description: 'Add a spell to a character sheet by name, copying the spell description from the spellbook.',
  async execute(message, args) {
    if (args.length < 2) {
      return message.reply('Usage: !addSpell [characterName] [spellName]');
    }
    const characterName = args[0];
    const spellName = args.slice(1).join(' ').toLowerCase();
    // Load spellbook
    let spellbook;
    try {
      spellbook = JSON.parse(fs.readFileSync(SPELLBOOK_PATH, 'utf8'));
    } catch (err) {
      return message.reply('Could not load the spellbook.');
    }
    // Find spell
    let foundSpell = null;
    for (const school in spellbook.spells) {
      for (const spell of spellbook.spells[school]) {
        if (spell.name.toLowerCase() === spellName) {
          foundSpell = spell;
          break;
        }
      }
      if (foundSpell) break;
    }
    if (!foundSpell) {
      return message.reply(`Spell "${args.slice(1).join(' ')}" not found in the spellbook.`);
    }
    // Load character sheet
    const sheetPath = path.join(SHEETS_DIR, `${characterName}.json`);
    let sheet;
    try {
      sheet = JSON.parse(fs.readFileSync(sheetPath, 'utf8'));
    } catch (err) {
      return message.reply(`Could not load character sheet for '${characterName}'.`);
    }
    // Add spell to character sheet (full object)
    if (!sheet.spells) sheet.spells = [];
    if (sheet.spells.some(s => s.name && s.name.toLowerCase() === foundSpell.name.toLowerCase())) {
      return message.reply(`'${characterName}' already knows the spell '${foundSpell.name}'.`);
    }
    // Deep copy the spell object to avoid reference issues
    const spellToAdd = JSON.parse(JSON.stringify(foundSpell));
    sheet.spells.push(spellToAdd);
    try {
      fs.writeFileSync(sheetPath, JSON.stringify(sheet, null, 2));
    } catch (err) {
      return message.reply('Failed to update character sheet.');
    }
    return message.reply(`Added spell '${foundSpell.name}' to '${characterName}'.`);
  }
};
