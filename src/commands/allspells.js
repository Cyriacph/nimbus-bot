const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Command handler for !allspells
module.exports = {
    name: 'allspells',
    description: 'Export all spells to a PDF',
    execute: async (message, args) => {
        const spellbookPath = path.join(__dirname, '..', '..', 'rule_documents', 'text_documents', 'spellbook.json');
        const pdfOutputPath = path.join(__dirname, '..', '..', 'character_sheets', 'pdf', 'allspells.pdf');

        // Load spellbook
        let spells;
        try {
            spells = JSON.parse(fs.readFileSync(spellbookPath, 'utf8'));
        } catch (err) {
            message.reply('Failed to load spellbook.json.');
            return;
        }

        // Create PDF
        const doc = new PDFDocument();
        doc.pipe(fs.createWriteStream(pdfOutputPath));
        doc.fontSize(20).text('All Spells', { align: 'center' });
        doc.moveDown();

        Object.entries(spells).forEach(([name, spell]) => {
            doc.fontSize(16).text(name, { underline: true });
            doc.fontSize(12).text(`Type: ${spell.type}`);
            doc.fontSize(12).text(spell.description);
            doc.moveDown();
        });

        doc.end();
        message.reply(`All spells exported to PDF: ${pdfOutputPath}`);
    }
};
