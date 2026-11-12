// search.test.js
// Tests for the rules glossary search (src/utils/textIndexer.js) and the Heroes glossary

const path = require('path');
const textIndexer = require('../src/utils/textIndexer');

const JSON_DIR = path.join(__dirname, '..', 'rule_documents', 'text_documents');

beforeAll(() => jest.spyOn(console, 'log').mockImplementation(() => {}));
afterAll(() => console.log.mockRestore());

const index = {
    'a.json': [
        { word: 'Damage', definition: 'How much harm an attack deals.' },
        { word: 'Lay on Hands', definition: 'Oathsworn healing pool.' },
        { word: 'Mage', definition: 'Elemental caster.' },
    ],
    'b.json': [
        { word: 'Invoker of Control', definition: 'Mage subclass.' },
    ],
};

describe('searchDictionary', () => {
    test('exact name comes first, then other matches', () => {
        const results = textIndexer.searchDictionary(index, 'mage');
        expect(results.map(r => r.word)).toEqual(['Mage', 'Invoker of Control']);
    });

    test('matches only at the start of a word ("mage" is not "damage")', () => {
        expect(textIndexer.searchDictionary(index, 'mage').some(r => r.word === 'Damage')).toBe(false);
    });

    test('multi-word phrases', () => {
        expect(textIndexer.searchDictionary(index, 'lay on hands')[0].word).toBe('Lay on Hands');
    });

    test('maxResults applies across all files and total counts everything', () => {
        // "mage" matches one entry in a.json and one in b.json.
        const results = textIndexer.searchDictionary(index, 'mage', 1);
        expect(results).toHaveLength(1);
        expect(results.total).toBe(2);
    });

    test('special characters in the keyword do not break the search', () => {
        expect(() => textIndexer.searchDictionary(index, 'strike!(')).not.toThrow();
    });
});

describe('formatSearchReply', () => {
    test('stays under the Discord limit and says how many were left out', () => {
        const long = Array.from({ length: 20 }, (_, i) => ({ word: `Entry ${i}`, definition: 'x'.repeat(300) }));
        long.total = 20;
        const reply = textIndexer.formatSearchReply('entry', long);
        expect(reply.length).toBeLessThanOrEqual(2000);
        expect(reply).toMatch(/\.\.\.and \d+ more/);
    });
});

describe('Heroes glossary file', () => {
    const all = textIndexer.indexJsonDictionaries(JSON_DIR);
    const heroes = all['01_Heroes-2.0.3.json'];

    test('is loaded by the indexer', () => {
        expect(Array.isArray(heroes)).toBe(true);
        expect(heroes.length).toBeGreaterThan(50);
    });

    test('has every class', () => {
        const words = heroes.map(e => e.word);
        for (const cls of ['Berserker', 'The Cheat', 'Commander', 'Hunter', 'Mage', 'Oathsworn',
            'Shadowmancer', 'Shepherd', 'Songweaver', 'Stormshifter', 'Zephyr']) {
            expect(words).toContain(cls);
        }
    });

    test('entries are well-formed, unique and short enough for Discord', () => {
        const seen = new Set();
        for (const e of heroes) {
            expect(typeof e.word).toBe('string');
            expect(typeof e.definition).toBe('string');
            expect(e.definition.length).toBeLessThanOrEqual(400);
            expect(seen.has(e.word.toLowerCase())).toBe(false);
            seen.add(e.word.toLowerCase());
        }
    });
});
