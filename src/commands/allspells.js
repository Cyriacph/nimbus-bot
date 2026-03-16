const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const SPELLBOOK_PATH = path.join(__dirname, '..', '..', 'rule_documents', 'text_documents', 'spellbook.json');
const PDF_OUTPUT_DIR = path.join(__dirname, '..', '..', 'character_sheets', 'pdf');

function allSpellsToPDF(callback) {
    if (!fs.existsSync(SPELLBOOK_PATH)) {
        callback(new Error('spellbook.json not found.'));
        return;
    }
    let spells;
    try {
        spells = JSON.parse(fs.readFileSync(SPELLBOOK_PATH, 'utf8'));
    } catch (err) {
        callback(new Error('Failed to parse spellbook.json.'));
        return;
    }
    if (!fs.existsSync(PDF_OUTPUT_DIR)) {
        fs.mkdirSync(PDF_OUTPUT_DIR);
    }
    const pdfPath = path.join(PDF_OUTPUT_DIR, 'allspells.pdf');
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);
    doc.fontSize(20).text('All Spells', { align: 'center' });
    doc.moveDown();
    Object.entries(spells.spells).forEach(([category, spellList]) => {
        doc.fontSize(18).text(category.charAt(0).toUpperCase() + category.slice(1), { underline: true });
        doc.moveDown();
        spellList.forEach(spell => {
            doc.fontSize(16).text(spell.name, { underline: true });
            doc.fontSize(12).text(`Tier: ${spell.tier || ''}`);
            doc.fontSize(12).text(`Type: ${spell.type || ''}`);
            doc.fontSize(12).text(`Cost: ${spell.cost || ''}`);
            doc.fontSize(12).text(`Range: ${spell.range || ''}`);
            doc.fontSize(12).text(`Damage: ${spell.damage || ''}`);
            doc.fontSize(12).text(`Effect: ${spell.effect || ''}`);
            doc.fontSize(12).text(`Description: ${spell.description || ''}`);
            if (spell.high_levels) doc.fontSize(12).text(`High Levels: ${spell.high_levels}`);
            if (spell.upcast) doc.fontSize(12).text(`Upcast: ${spell.upcast}`);
            if (spell.duration) doc.fontSize(12).text(`Duration: ${spell.duration}`);
            if (spell.abilities) {
                doc.fontSize(12).text('Abilities:');
                spell.abilities.forEach(ability => {
                    doc.fontSize(12).text(`- ${ability.name}: ${ability.description}`);
                });
            }
            doc.moveDown();
        });
        doc.moveDown();
    });
    doc.end();
    stream.on('finish', () => {
        callback(null, pdfPath);
    });
    stream.on('error', err => {
        callback(err);
    });
}

module.exports = {
    allSpellsToPDF,
    name: 'allspells',
    description: 'Export all spells to a PDF',
    execute: async (message, args) => {
        allSpellsToPDF((err, pdfPath) => {
            if (err) {
                message.reply(`Error generating spells PDF: ${err.message}`);
                return;
            }
            message.reply({
                content: `PDF containing all spells generated.`,
                files: [pdfPath],
            });
        });
    }
};
