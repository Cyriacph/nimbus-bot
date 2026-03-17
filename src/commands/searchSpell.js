// searchSpell.js
// Command to search for a spell by name in spellbook.json and return its description

const fs = require('fs');
const path = require('path');

const SPELLBOOK_PATH = path.join(__dirname, '../../rule_documents/text_documents/spellbook.json');

module.exports = {
  name: 'searchspell',
  description: 'Search for a spell by name and return its description.',
  execute: async (message, args) => {
    if (!args.length) {
      return message.reply('Please provide the name of the spell to search for.');
    }
    const spellName = args.join(' ').toLowerCase();
    let spellbook;
    try {
      spellbook = JSON.parse(fs.readFileSync(SPELLBOOK_PATH, 'utf8'));
    } catch (err) {
      return message.reply('Could not load the spellbook.');
    }
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
      return message.reply(`Spell "${args.join(' ')}" not found in the spellbook.`);
    }
    let response = `**${foundSpell.name}**\n`;
    if (foundSpell.tier) response += `*Tier:* ${foundSpell.tier}\n`;
    if (foundSpell.cost) response += `*Cost:* ${foundSpell.cost}\n`;
    if (foundSpell.type) response += `*Type:* ${foundSpell.type}\n`;
    if (foundSpell.range) response += `*Range:* ${foundSpell.range}\n`;
    if (foundSpell.damage) response += `*Damage:* ${foundSpell.damage}\n`;
    if (foundSpell.effect) response += `*Effect:* ${foundSpell.effect}\n`;
    if (foundSpell.high_levels) response += `*High Levels:* ${foundSpell.high_levels}\n`;
    if (foundSpell.upcast) response += `*Upcast:* ${foundSpell.upcast}\n`;
    if (foundSpell.duration) response += `*Duration:* ${foundSpell.duration}\n`;
    response += `*Description:* ${foundSpell.description}`;
    return message.reply(response);
  }
};
