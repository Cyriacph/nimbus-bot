const fs = require('fs');
const { fetchCharacterSheet } = require('./fetchSheet');
const { storeCharacterSheet } = require('./storeSheet');
const { CONDITIONS_DB } = require('../constants/conditions');

/**
 * Handles the !condition command
 * @param {Object} message - The Discord message object
 * @param {Array<string>} args - The command arguments [characterName, condition_name]
 */
function handleConditionCommand(message, args) {
  if (args.length < 2) {
    message.reply("Usage: !condition <characterName> <condition_name>\nDescription: Toggle a condition for a character.");
    return;
  }

  const characterName = args[0];
  const rawConditionName = args[1].toLowerCase();

  // Validate condition
  if (!CONDITIONS_DB.hasOwnProperty(rawConditionName)) {
    const validConditions = Object.keys(CONDITIONS_DB).join(', ');
    message.reply(`Invalid condition '${rawConditionName}'. Valid conditions are: ${validConditions}`);
    return;
  }

  try {
    // Fetch the character sheet path
    const sheetPath = fetchCharacterSheet(characterName);
    
    // Read and parse the JSON file
    const sheetData = JSON.parse(fs.readFileSync(sheetPath, 'utf8'));

    // Ensure conditions array exists in the character sheet
    if (!sheetData.character_sheet) {
      throw new Error('Invalid character sheet structure.');
    }
    
    if (!sheetData.character_sheet.conditions) {
      sheetData.character_sheet.conditions = [];
    }

    const conditionsArray = sheetData.character_sheet.conditions;
    const conditionIndex = conditionsArray.indexOf(rawConditionName);
    let actionTaken = '';

    // Toggle the condition
    if (conditionIndex > -1) {
      // Condition is present, remove it
      conditionsArray.splice(conditionIndex, 1);
      actionTaken = 'removed from';
    } else {
      // Condition is missing, add it
      conditionsArray.push(rawConditionName);
      actionTaken = 'added to';
    }

    // Save the modified sheet back
    storeCharacterSheet(characterName, sheetData);

    // Send success message with description
    const description = CONDITIONS_DB[rawConditionName];
    message.reply(`Condition '${rawConditionName}' has been ${actionTaken} ${characterName}.\n**Description:** ${description}`);

  } catch (err) {
    message.reply(`Error managing condition: ${err.message}`);
  }
}

module.exports = {
  handleConditionCommand
};
