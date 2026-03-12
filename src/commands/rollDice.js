
// dice.js
// Dice rolling logic for the Discord bot
const { DiceNotationError, InvalidDieError, DiceRangeError } = require('../errors/errors');
const { VALID_DICE_TYPES, MIN_DICE, MAX_DICE } = require('../constants/dice');
const { ERROR_MESSAGES } = require('../errors/errors');

function parseDiceNotation(notation) {
    // Matches ndf+x or ndf-x, e.g., 2d6+3, 1d20-2
    const regex = /^(\d+)[dD](\d+)([+-]\d+)?$/;
    const match = notation.trim().match(regex);
    if (!match) {
        throw new DiceNotationError(ERROR_MESSAGES.INVALID_NOTATION);
    }
    const numDice = parseInt(match[1], 10);
    const numFaces = parseInt(match[2], 10);
    const modifier = match[3] ? parseInt(match[3], 10) : 0;
    return { numDice, numFaces, modifier };
}

function isValidDie(numFaces) {
    return VALID_DICE_TYPES.includes(numFaces);
}

function rollDice(numDice, numFaces) {
    const rolls = [];
    for (let i = 0; i < numDice; i++) {
        rolls.push(Math.floor(Math.random() * numFaces) + 1);
    }
    return rolls;
}

function roll(notation) {
    const { numDice, numFaces, modifier } = parseDiceNotation(notation);
    if (numDice < MIN_DICE || numDice > MAX_DICE) {
        throw new DiceRangeError(ERROR_MESSAGES.DICE_RANGE.replace('{min}', MIN_DICE).replace('{max}', MAX_DICE));
    }
    if (!isValidDie(numFaces)) {
        throw new InvalidDieError(ERROR_MESSAGES.UNSUPPORTED_DIE.replace('{faces}', numFaces));
    }
    const rolls = rollDice(numDice, numFaces);
    const total = rolls.reduce((a, b) => a + b, 0) + modifier;
    const isCritSuccess = numFaces == 20 && rolls.includes(20);
    const isCritFailure = numFaces == 20 && rolls.includes(1);
    return {
        rolls,
        modifier,
        total,
        numDice,
        numFaces,
        isCritSuccess,
        isCritFailure
    };
}

module.exports = {
    roll,
    parseDiceNotation,
    isValidDie
};
