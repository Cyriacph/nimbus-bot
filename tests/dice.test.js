// dice.test.js
// Automated tests for dice.js and error handling

const dice = require('../src/dice_command/dice');
const { DiceNotationError, InvalidDieError, DiceRangeError } = require('../src/dice_command/dice_errors');

describe('Dice Module', () => {
    test('Valid dice roll: 2d6', () => {
        const result = dice.roll('2d6');
        expect(result.numDice).toBe(2);
        expect(result.numFaces).toBe(6);
        expect(result.rolls.length).toBe(2);
        expect(typeof result.total).toBe('number');
    });

    test('Valid dice roll with modifier: 1d20+5', () => {
        const result = dice.roll('1d20+5');
        expect(result.numDice).toBe(1);
        expect(result.numFaces).toBe(20);
        expect(result.modifier).toBe(5);
        expect(result.total).toBeGreaterThanOrEqual(6);
    });

    test('Valid dice roll with negative modifier: 3d8-2', () => {
        const result = dice.roll('3d8-2');
        expect(result.numDice).toBe(3);
        expect(result.numFaces).toBe(8);
        expect(result.modifier).toBe(-2);
    });

    test('Invalid dice notation throws DiceNotationError', () => {
        expect(() => dice.roll('foo')).toThrow(DiceNotationError);
    });

    test('Unsupported die throws InvalidDieError', () => {
        expect(() => dice.roll('1d7')).toThrow(InvalidDieError);
    });

    test('Too many dice throws DiceRangeError', () => {
        expect(() => dice.roll('101d6')).toThrow(DiceRangeError);
    });

    test('Zero dice throws DiceRangeError', () => {
        expect(() => dice.roll('0d6')).toThrow(DiceRangeError);
    });
});
