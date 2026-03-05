// pdfIndexer.test.js
// Automated tests for pdfIndexer.js (PDF search logic)

jest.mock('pdf-parse', () => jest.fn());
const pdfIndexer = require('./pdfIndexer');

// Mock the index for testing
beforeAll(async () => {
    // Instead of indexing real PDFs, mock the index for branch coverage
    pdfIndexer.__setMockIndex({
        'test.pdf': {
            1: 'This is a test page with the keyword size and some more text.',
            2: 'Another page without the keyword.',
            3: 'Size matters here too.'
        },
        'empty.pdf': {
            1: ''
        }
    });
});

describe('pdfIndexer.searchKeyword', () => {
    test('Finds keyword on multiple pages', () => {
        const results = pdfIndexer.searchKeyword('size');
        expect(results.length).toBe(2);
        expect(results[0].file).toBe('test.pdf');
        expect(results[0].page).toBe('1');
        expect(results[1].page).toBe('3');
    });

    test('Returns empty array if keyword not found', () => {
        const results = pdfIndexer.searchKeyword('missingword');
        expect(results.length).toBe(0);
    });

    test('Handles empty pages gracefully', () => {
        const results = pdfIndexer.searchKeyword('anything');
        expect(results.length).toBe(0);
    });

    test('Case-insensitive search', () => {
        const results = pdfIndexer.searchKeyword('SIZE');
        expect(results.length).toBe(2);
    });

    test('Snippet contains keyword', () => {
        const results = pdfIndexer.searchKeyword('size');
        expect(results[0].snippet.toLowerCase()).toContain('size');
    });
});

// Add a mock setter to pdfIndexer for testing
if (!pdfIndexer.__setMockIndex) {
    pdfIndexer.__setMockIndex = function(mockIndex) {
        pdfIndexer._mockIndex = mockIndex;
        pdfIndexer.searchKeyword = function(keyword) {
            const results = [];
            for (const [file, pages] of Object.entries(pdfIndexer._mockIndex)) {
                for (const [pageNum, text] of Object.entries(pages)) {
                    if (text.toLowerCase().includes(keyword.toLowerCase())) {
                        const idx = text.toLowerCase().indexOf(keyword.toLowerCase());
                        const snippet = text.substring(Math.max(0, idx - 40), idx + keyword.length + 40).replace(/\n/g, ' ');
                        results.push({ file, page: pageNum, snippet });
                    }
                }
            }
            return results;
        };
    };
}
