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
  UPDATE_ATTRIBUTE: '!updateAttribute'
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
  UPDATE_ATTRIBUTE: 'Usage: !updateAttribute <characterName> <attribute> <value> (value must be 0-20)'
};

module.exports = {
  COMMANDS,
  USAGE
};
