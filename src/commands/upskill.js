const fs = require("fs");
const path = require("path");

const VALID_SKILLS = [
  "arcana",
  "examination",
  "finesse",
  "influence",
  "insight",
  "lore",
  "might",
  "naturecraft",
  "perception",
  "stealth",
];

function upskill(characterName, skillName) {
  const characterPath = path.join(
    __dirname,
    "../../character_sheets",
    `${characterName}.json`,
  );

  if (!fs.existsSync(characterPath)) {
    throw new Error(`Character '${characterName}' not found.`);
  }

  if (!VALID_SKILLS.includes(skillName.toLowerCase())) {
    throw new Error(`Invalid skill '${skillName}'.`);
  }

  const character = JSON.parse(fs.readFileSync(characterPath, "utf8"));

  const skills = character.character_sheet.skills;

  if (!(skillName in skills)) {
    throw new Error(`Skill '${skillName}' does not exist on this character.`);
  }

  skills[skillName] += 1;

  fs.writeFileSync(characterPath, JSON.stringify(character, null, 2));

  return skills[skillName];
}

module.exports = { upskill };
