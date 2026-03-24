/**
 * Rolls initiative for character (1d20 + dexterity).
 * A single digit means the player starts with one action, a double digits
 * means two actions and 20+ or a natural 20 means they start with all three actions.
 *
 * Usage: !initiative [characterName]
 *
 * Returns the initiative roll for the character and the number of actions they start with.
 */

const { roll } = require("./rollDice");
const { fetchCharacterSheet } = require("./fetchSheet");
const fs = require("fs");

function initiative(characterName) {
  const filePath = fetchCharacterSheet(characterName);
  const sheetData = fs.readFileSync(filePath, "utf8");
  const sheetJSON = JSON.parse(sheetData);
  const sheet = sheetJSON.character_sheet;

  const initiative = sheet.initiative;
  const initiativeRoll = roll("1d20+" + initiative);
  const initiativeTotal = initiativeRoll.total;

  // Determine the number of actions according to the dice roll and the initiative modifier
  // A natural 20 means the dice roll gave 20 without any modifiers
  const actions =
    initiativeTotal > 20 || initiativeRoll.rolls[0] == 20
      ? 3
      : initiativeTotal >= 10
        ? 2
        : 1;

  return {
    initiativeRoll,
    actions,
  };
}

module.exports = {
  initiative,
};
