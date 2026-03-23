// removeSpell.js
// Command to remove a spell from a character sheet by name

const fs = require('fs');
const path = require('path');

const SHEETS_DIR = path.join(__dirname, '../../character_sheets/');

module.exports = {
  name: 'removeSpell',
  description: 'Remove a spell from a character sheet by name.',
  async execute(message, args) {
    if (args.length < 2) {
      return message.reply('Usage: !removeSpell [characterName] [spellName]');
    }
    const characterName = args[0];
    const spellName = args.slice(1).join(' ').toLowerCase();
    const sheetPath = path.join(SHEETS_DIR, `${characterName}.json`);
    let data;
    try {
      data = JSON.parse(fs.readFileSync(sheetPath, 'utf8'));
    } catch (err) {
      return message.reply(`Could not load character sheet for '${characterName}'.`);
    }
    // Find spells array (support both top-level and nested)
    let spells = null;
    let spellsLocation = null;
    if (Array.isArray(data.spells)) {
      spells = data.spells;
      spellsLocation = 'top';
    } else if (data.character_sheet && Array.isArray(data.character_sheet.spells)) {
      spells = data.character_sheet.spells;
      spellsLocation = 'nested';
    }
    if (!spells || spells.length === 0) {
      return message.reply(`'${characterName}' does not know any spells.`);
    }
    const index = spells.findIndex(s => s && s.name && s.name.toLowerCase() === spellName);
    if (index === -1) {
      return message.reply(`'${characterName}' does not know the spell '${args.slice(1).join(' ')}'.`);
    }
    const removed = spells.splice(index, 1)[0];
    // Save back to correct location
    if (spellsLocation === 'top') {
      data.spells = spells;
    } else if (spellsLocation === 'nested') {
      data.character_sheet.spells = spells;
    }
    try {
      fs.writeFileSync(sheetPath, JSON.stringify(data, null, 2));
    } catch (err) {
      return message.reply('Failed to update character sheet.');
    }
    return message.reply(`Removed spell '${removed.name}' from '${characterName}'.`);
  }
};
