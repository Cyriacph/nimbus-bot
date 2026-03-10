// Command-related constants

const COMMANDS = {
  ROLL: '!roll',
  SEARCH: '!search',
  FETCH: '!fetch',
  ADD: '!add',
  SKILLCHECK: '!skillcheck',
  READ: '!read',
  STORE: '!store'
};

const USAGE = {
  ROLL: 'Please provide dice notation, e.g., !roll 2d6+3',
  SEARCH: 'Please provide a keyword to search for, e.g., !search stealth',
  FETCH: 'Usage: !fetch <characterName>',
  ADD: 'Usage: !add <characterName> (attach JSON file)',
  SKILLCHECK: 'Usage: !skillcheck <characterName> <skillName>',
  READ: 'Usage: !read <characterName>',
  STORE: 'Usage: !store <characterName> <characterSheetJSON>'
};

module.exports = {
  COMMANDS,
  USAGE
};
