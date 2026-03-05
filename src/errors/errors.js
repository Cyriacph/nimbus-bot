// Error-related constants

const ERROR_NAMES = {
  DICE_NOTATION: 'DiceNotationError',
  INVALID_DIE: 'InvalidDieError',
  DICE_RANGE: 'DiceRangeError'
};

const ERROR_MESSAGES = {
  INVALID_NOTATION: 'Invalid dice notation. Use format NdF+X, e.g., 2d6+3',
  UNSUPPORTED_DIE: 'A {faces}-sided die is not supported. Use common dice (d2, d4, d6, d8, d10, d12, d20, d100).',
  DICE_RANGE: 'Number of dice must be between {min} and {max}.'
};

module.exports = {
  ERROR_NAMES,
  ERROR_MESSAGES
};
