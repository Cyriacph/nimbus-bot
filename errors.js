// errors.js
// Custom error classes for dice rolling and bot logic

class DiceNotationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'DiceNotationError';
    }
}

class InvalidDieError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InvalidDieError';
    }
}

class DiceRangeError extends Error {
    constructor(message) {
        super(message);
        this.name = 'DiceRangeError';
    }
}

module.exports = {
    DiceNotationError,
    InvalidDieError,
    DiceRangeError
};
