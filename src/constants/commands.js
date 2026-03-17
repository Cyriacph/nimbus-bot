// Command-related constants

const COMMANDS = {
  ROLL: '!roll',
  SEARCH: '!search',
  FETCH: '!fetch',
  ADD: '!add',
  ADD_HP: '!addhp',
  SKILLCHECK: '!skillcheck',
  READ: '!read',
  STORE: '!store',
  SET_STATS: '!setstats',
  MAX_HP: '!maxhp',
  DAMAGE: '!damage',
  HEAL: '!heal',
  WOUND: '!wound',
  UPSKILL: "Usage: !upskill <characterName> <skillName>",
  INITIATIVE: '!initiative',
  CONDITION: '!condition',
  ALLSPELLS: '!allspells',
  SEARCH_SPELL: '!searchspell'
};

const USAGE = {
  ROLL: 'Please provide dice notation, e.g., !roll 2d6+3',
  SEARCH: 'Please provide a keyword to search for, e.g., !search stealth',
  FETCH: 'Usage: !fetch <characterName>',
  ADD: 'Usage: !add <characterName> (attach JSON file)',
  ADD_HP: 'Usage: !addhp <characterName> <value>',
  SKILLCHECK: 'Usage: !skillcheck <characterName> <skillName>',
  READ: 'Usage: !read <characterName>',
  STORE: 'Usage: !store <characterName> <characterSheetJSON>',
  SET_STATS: 'Usage: !setstats <characterName> <stat> <value>',
  MAX_HP: 'Usage: !maxhp <characterName> <value>',
  INITIATIVE: 'Usage: !initiative <characterName>',
  CONDITION: 'Usage: !condition <characterName> <condition_name>\nDescription: Toggle a condition for a character.',
  ALLSPELLS: 'Usage: !allspells',
  DAMAGE: 'Usage: !damage <characterName> <amount>',
  SEARCH_SPELL: 'Usage: !searchspell <spell name>',
  HEAL: 'Usage: !heal <characterName> <amount>',
  WOUND: 'Usage: !wound <characterName> <amount>',
  INITIATIVE: 'Usage: !initiative <characterName>'
};

module.exports = {
  COMMANDS,
  USAGE,
};
