// Command-related constants

const COMMANDS = {
  UPSKILL: '!upskill',
  ROLL: '!roll',
  SEARCH: '!search',
  FETCH: '!fetch',
  ADD: '!add',
  ADD_HP: '!addhp',
  SKILLCHECK: '!skillcheck',
  READ: '!read',
  STORE: '!store',
  SET_STATS: '!setstats',
  MAX_HP: '!maxhp'
};

const USAGE = {
  UPSKILL: 'Usage: !upskill <characterName> <skillName>',
  ROLL: 'Please provide dice notation, e.g., !roll 2d6+3',
  SEARCH: 'Please provide a keyword to search for, e.g., !search stealth',
  FETCH: 'Usage: !fetch <characterName>',
  ADD: 'Usage: !add <characterName> (attach JSON file)',
  ADD_HP: 'Usage: !addhp <characterName> <value>',
  SKILLCHECK: 'Usage: !skillcheck <characterName> <skillName>',
  READ: 'Usage: !read <characterName>',
  STORE: 'Usage: !store <characterName> <characterSheetJSON>',
  SET_STATS: 'Usage: !setstats <characterName> <stat> <value>',
  MAX_HP: 'Usage: !maxhp <characterName> <value>'
};

module.exports = {
  COMMANDS,
  USAGE
};
