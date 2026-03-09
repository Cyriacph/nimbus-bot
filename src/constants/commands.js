// Command-related constants

const COMMANDS = {
  ROLL: '!roll',
  SEARCH: '!search',
  FETCH: '!fetch',
  ADD: '!add'
};

const USAGE = {
  ROLL: 'Please provide dice notation, e.g., !roll 2d6+3',
  SEARCH: 'Please provide a keyword to search for, e.g., !search stealth',
  FETCH: 'Usage: !fetch <characterName>',
  ADD: 'Usage: !add <characterName> (attach JSON file)'
};

module.exports = {
  COMMANDS,
  USAGE
};
