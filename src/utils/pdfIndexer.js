
// PDF Indexer utility for rule search using pdfjs-dist
const fs = require('fs');
const path = require('path');
const pdfjsLib = require('pdfjs-dist/es5/build/pdf.js');

async function extractTextByPage(pdfPath) {
	const data = new Uint8Array(fs.readFileSync(pdfPath));
	const pdf = await pdfjsLib.getDocument({ data }).promise;
	const numPages = pdf.numPages;
	const pages = {};
	for (let i = 1; i <= numPages; i++) {
		const page = await pdf.getPage(i);
		const content = await page.getTextContent();
		const pageText = content.items.map(item => item.str).join(' ');
		pages[i] = pageText;
	}
	return pages;
}

async function indexPDFs(pdfDir) {
	const files = fs.readdirSync(pdfDir).filter(f => f.endsWith('.pdf'));
	const pdfIndex = {};
	for (const file of files) {
		const filePath = path.join(pdfDir, file);
		pdfIndex[file] = await extractTextByPage(filePath);
	}
	return pdfIndex;
}

function searchKeyword(pdfIndex, keyword, snippetRadius = 40, maxResults = 10) {
	const results = [];
	for (const [file, pages] of Object.entries(pdfIndex)) {
		for (const [pageNum, text] of Object.entries(pages)) {
			if (text.toLowerCase().includes(keyword.toLowerCase())) {
				const idx = text.toLowerCase().indexOf(keyword.toLowerCase());
				const snippet = text.substring(Math.max(0, idx - snippetRadius), idx + keyword.length + snippetRadius).replace(/\n/g, ' ');
				results.push({ file, page: pageNum, snippet });
			}
		}
	}
	return results.slice(0, maxResults);
}

module.exports = {
	indexPDFs,
	searchKeyword
};
