/**
 * Class feature management (issue #53).
 *
 * Features are stored in character_sheet.abilities as { name, description },
 * which the empty character sheet template already provides and which
 * characterSheetToPDF already prints under "Abilities".
 *
 * Commands:
 *   !addfeature <characterName> <featureName> <description>
 *   !addfeature <characterName> "<Feature Name>" <description>
 *   !myfeatures <characterName>
 *   !feature <characterName> <featureName>
 *   !removefeature <characterName> <featureName>
 */

const fs = require('fs');
const { fetchCharacterSheet } = require('./fetchSheet');

// Discord rejects messages longer than 2000 characters.
const DISCORD_MAX_LENGTH = 2000;

/**
 * Splits the text after "<command> <characterName>" into a feature name and
 * the rest. A multi-word name can be wrapped in double quotes (straight or
 * curly, since phones often insert curly ones); otherwise the name is the
 * first word.
 * @param {string} text
 * @returns {{ name: string, rest: string }}
 */
function parseNameAndRest(text) {
  const trimmed = (text || '').trim();
  const quoted = trimmed.match(/^["“”]([^"“”]+)["“”]\s*([\s\S]*)$/);
  if (quoted) {
    return { name: quoted[1].trim(), rest: quoted[2].trim() };
  }
  const match = trimmed.match(/^(\S+)\s*([\s\S]*)$/);
  if (!match) return { name: '', rest: '' };
  return { name: match[1], rest: match[2].trim() };
}

/**
 * Returns the raw text that follows "<command> <characterName>" in a message,
 * keeping the original spacing and line breaks of pasted descriptions.
 */
function textAfterCharacterName(content) {
  const match = (content || '').match(/^\s*\S+\s+\S+\s*([\s\S]*)$/);
  return match ? match[1] : '';
}

function loadSheet(characterName) {
  const filePath = fetchCharacterSheet(characterName);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (!data.character_sheet) {
    throw new Error('Invalid character sheet structure.');
  }
  if (!Array.isArray(data.character_sheet.abilities)) {
    data.character_sheet.abilities = [];
  }
  return { filePath, data, features: data.character_sheet.abilities };
}

function saveSheet(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function findIndex(features, featureName) {
  const wanted = featureName.toLowerCase();
  return features.findIndex(f => f && f.name && f.name.toLowerCase() === wanted);
}

function addFeature(characterName, featureName, description) {
  if (!featureName) throw new Error('Feature name is required.');
  if (!description) throw new Error('Feature description is required.');
  const { filePath, data, features } = loadSheet(characterName);
  if (findIndex(features, featureName) !== -1) {
    throw new Error(`'${characterName}' already has the feature '${featureName}'.`);
  }
  const feature = { name: featureName, description };
  features.push(feature);
  saveSheet(filePath, data);
  return feature;
}

function listFeatures(characterName) {
  return loadSheet(characterName).features.filter(f => f && f.name);
}

function getFeature(characterName, featureName) {
  const { features } = loadSheet(characterName);
  const index = findIndex(features, featureName);
  return index === -1 ? null : features[index];
}

function removeFeature(characterName, featureName) {
  const { filePath, data, features } = loadSheet(characterName);
  const index = findIndex(features, featureName);
  if (index === -1) return null;
  const [removed] = features.splice(index, 1);
  saveSheet(filePath, data);
  return removed;
}

function fitDiscord(text) {
  if (text.length <= DISCORD_MAX_LENGTH) return text;
  return text.slice(0, DISCORD_MAX_LENGTH - 30) + '\n… (truncated, see !read)';
}

// --- Discord command handlers -------------------------------------------

async function handleAddFeature(message, args, usage) {
  const characterName = args[0];
  const { name, rest } = parseNameAndRest(textAfterCharacterName(message.content));
  if (!characterName || !name || !rest) {
    return message.reply(usage);
  }
  try {
    const feature = addFeature(characterName, name, rest);
    return message.reply(`Added feature '${feature.name}' to '${characterName}'.`);
  } catch (err) {
    return message.reply(`Error adding feature: ${err.message}`);
  }
}

async function handleMyFeatures(message, args, usage) {
  const characterName = args[0];
  if (!characterName) return message.reply(usage);
  try {
    const features = listFeatures(characterName);
    if (features.length === 0) {
      return message.reply(`No features found for '${characterName}'.`);
    }
    const list = features.map(f => `- ${f.name}`).join('\n');
    return message.reply(fitDiscord(`Features for '${characterName}':\n${list}`));
  } catch (err) {
    return message.reply(`Error fetching features: ${err.message}`);
  }
}

async function handleFeature(message, args, usage) {
  const characterName = args[0];
  // Quotes are optional here: "!feature Kaladin Lay on Hands" works too.
  const featureName = args.slice(1).join(' ').replace(/["“”]/g, '').trim();
  if (!characterName || !featureName) return message.reply(usage);
  try {
    const feature = getFeature(characterName, featureName);
    if (!feature) {
      return message.reply(`'${characterName}' does not have the feature '${featureName}'.`);
    }
    return message.reply(fitDiscord(`**${feature.name}**\n${feature.description}`));
  } catch (err) {
    return message.reply(`Error fetching feature: ${err.message}`);
  }
}

async function handleRemoveFeature(message, args, usage) {
  const characterName = args[0];
  const featureName = args.slice(1).join(' ').replace(/["“”]/g, '').trim();
  if (!characterName || !featureName) return message.reply(usage);
  try {
    const removed = removeFeature(characterName, featureName);
    if (!removed) {
      return message.reply(`'${characterName}' does not have the feature '${featureName}'.`);
    }
    return message.reply(`Removed feature '${removed.name}' from '${characterName}'.`);
  } catch (err) {
    return message.reply(`Error removing feature: ${err.message}`);
  }
}

module.exports = {
  parseNameAndRest,
  textAfterCharacterName,
  addFeature,
  listFeatures,
  getFeature,
  removeFeature,
  handleAddFeature,
  handleMyFeatures,
  handleFeature,
  handleRemoveFeature,
};
