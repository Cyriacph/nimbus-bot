// features.test.js
// Tests for class feature management (src/commands/features.js)

const fs = require('fs');
const path = require('path');
const features = require('../src/commands/features');

const SHEETS_DIR = path.join(__dirname, '..', 'character_sheets');
const TEMPLATE = path.join(SHEETS_DIR, 'EmptyNimbleCharacterSheet.json');
const NAME = 'ZzFeatureTest';
const SHEET = path.join(SHEETS_DIR, `${NAME}.json`);

beforeEach(() => fs.copyFileSync(TEMPLATE, SHEET));
afterAll(() => fs.existsSync(SHEET) && fs.unlinkSync(SHEET));

describe('parseNameAndRest', () => {
    test('single-word name', () => {
        expect(features.parseNameAndRest('Rage Enter a fury.')).toEqual({ name: 'Rage', rest: 'Enter a fury.' });
    });
    test('quoted multi-word name', () => {
        expect(features.parseNameAndRest('"Lay on Hands" Heal 5 HP.')).toEqual({ name: 'Lay on Hands', rest: 'Heal 5 HP.' });
    });
    test('curly quotes from phones', () => {
        expect(features.parseNameAndRest('“Sneak Attack” Extra damage.')).toEqual({ name: 'Sneak Attack', rest: 'Extra damage.' });
    });
    test('keeps line breaks in description', () => {
        expect(features.parseNameAndRest('Rage Line one\nLine two').rest).toBe('Line one\nLine two');
    });
});

describe('textAfterCharacterName', () => {
    test('strips command and character name', () => {
        expect(features.textAfterCharacterName('!addfeature Kaladin "Lay on Hands" Heal.')).toBe('"Lay on Hands" Heal.');
    });
});

describe('feature storage', () => {
    test('add, list, get, remove', () => {
        features.addFeature(NAME, 'Lay on Hands', 'Heal a creature.');
        features.addFeature(NAME, 'Rage', 'Enter a fury.');
        expect(features.listFeatures(NAME).map(f => f.name)).toEqual(['Lay on Hands', 'Rage']);
        expect(features.getFeature(NAME, 'lay on hands').description).toBe('Heal a creature.');

        const saved = JSON.parse(fs.readFileSync(SHEET, 'utf8'));
        expect(saved.character_sheet.abilities).toHaveLength(2);

        expect(features.removeFeature(NAME, 'RAGE').name).toBe('Rage');
        expect(features.listFeatures(NAME).map(f => f.name)).toEqual(['Lay on Hands']);
    });

    test('rejects duplicates (case-insensitive)', () => {
        features.addFeature(NAME, 'Rage', 'Enter a fury.');
        expect(() => features.addFeature(NAME, 'rage', 'Again.')).toThrow(/already has/);
    });

    test('requires a description', () => {
        expect(() => features.addFeature(NAME, 'Rage', '')).toThrow(/description/);
    });

    test('unknown feature returns null', () => {
        expect(features.getFeature(NAME, 'Nope')).toBeNull();
        expect(features.removeFeature(NAME, 'Nope')).toBeNull();
    });

    test('unknown character throws', () => {
        expect(() => features.listFeatures('NoSuchCharacter123')).toThrow(/No character sheet/);
    });
});
