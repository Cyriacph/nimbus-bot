
// dice.js
// Dice rolling logic for the Discord bot
const { DiceNotationError, InvalidDieError, DiceRangeError } = require('./dice_errors');

function parseDiceNotation(notation) {
    // Matches ndf+x or ndf-x, e.g., 2d6+3, 1d20-2
    const regex = /^(\d+)[dD](\d+)([+-]\d+)?$/;
    const match = notation.trim().match(regex);
    if (!match) {
        throw new DiceNotationError('Invalid dice notation. Use format NdF+X, e.g., 2d6+3');
    }
    const numDice = parseInt(match[1], 10);
    const numFaces = parseInt(match[2], 10);
    const modifier = match[3] ? parseInt(match[3], 10) : 0;
    return { numDice, numFaces, modifier };
}

function isValidDie(numFaces) {
    // Only allow common dice: 2, 4, 6, 8, 10, 12, 20, 100
    const validDice = [2, 4, 6, 8, 10, 12, 20, 100];
    return validDice.includes(numFaces);
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
    if (numDice < 1 || numDice > 100) {
        throw new DiceRangeError('Number of dice must be between 1 and 100.');
    }
    if (!isValidDie(numFaces)) {
        throw new InvalidDieError(`A ${numFaces}-sided die is not supported. Use common dice (d2, d4, d6, d8, d10, d12, d20, d100).`);
    }
    const rolls = rollDice(numDice, numFaces);
    const total = rolls.reduce((a, b) => a + b, 0) + modifier;
    return {
        rolls,
        modifier,
        total,
        numDice,
        numFaces
    };
}

module.exports = {
    roll,
    parseDiceNotation,
    isValidDie
};
