const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const CHARACTER_SHEET_DIR = path.join(__dirname, '..', '..', 'character_sheets');
const PDF_OUTPUT_DIR = path.join(__dirname, '..', '..', 'character_sheets', 'pdf');

function characterSheetToPDF(characterName, callback) {
    const safeName = characterName.replace(/[^a-zA-Z0-9_-]/g, '_');
    const jsonPath = path.join(CHARACTER_SHEET_DIR, `${safeName}.json`);
    if (!fs.existsSync(jsonPath)) {
        callback(new Error(`No character sheet found for '${characterName}'.`));
        return;
    }
    const sheet = JSON.parse(fs.readFileSync(jsonPath, 'utf8')).character_sheet;
    if (!fs.existsSync(PDF_OUTPUT_DIR)) {
        fs.mkdirSync(PDF_OUTPUT_DIR);
    }
    const pdfPath = path.join(PDF_OUTPUT_DIR, `${safeName}.pdf`);
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);

    doc.fontSize(18).text(`Character Sheet: ${sheet.basic_details.character_name}`, { underline: true });
    doc.moveDown();

    // ...existing code...
    doc.fontSize(12).text(`Ancestry: ${sheet.basic_details.ancestry}`);
    doc.text(`Class: ${sheet.basic_details.class}`);
    doc.text(`Level: ${sheet.basic_details.level}`);
    doc.text(`Height: ${sheet.basic_details.height}`);
    doc.text(`Weight: ${sheet.basic_details.weight}`);
    doc.text(`Hit Dice: ${sheet.basic_details.hit_dice}`);
    doc.moveDown();
    doc.text(`HP: ${sheet.hit_points.current}/${sheet.hit_points.max} (Temp: ${sheet.hit_points.temp_hp})`);
    doc.text(`Wounds: ${sheet.wounds.current}/${sheet.wounds.max}`);
    doc.text(`Armor: ${sheet.armor}`);
    doc.text(`Initiative: ${sheet.initiative}`);
    doc.text(`Speed: ${sheet.speed}`);
    doc.text(`Inventory Slots: ${sheet.inventory_slots.used}/${sheet.inventory_slots.total}`);
    doc.moveDown();
    doc.text('Stats:');
    Object.entries(sheet.stats).forEach(([stat, val]) => {
        doc.text(`  ${stat.charAt(0).toUpperCase() + stat.slice(1)}: ${val.value} (Save: ${val.save})`);
    });
    doc.moveDown();
    doc.text('Skills:');
    Object.entries(sheet.skills).forEach(([skill, skillObj]) => {
        const statName = skillObj.base;
        const statValue = sheet.stats[statName]?.value ?? 0;
        const bonus = skillObj.bonus ?? 0;
        const skillValue = statValue + bonus;
        doc.text(`  ${skill.charAt(0).toUpperCase() + skill.slice(1)}: ${skillValue}`);
    });
    doc.moveDown();
    doc.text('Equipment:');
    sheet.equipment.forEach(item => {
        doc.text(`  ${item.name} (${item.type}) - ${item.properties} ${item.damage ? 'Damage: ' + item.damage : ''}`);
    });
    doc.moveDown();
    doc.text('Languages: ' + sheet.languages.join(', '));
    doc.moveDown();

    // Add Conditions section (only current, names only)
    const conditions = sheet.conditions || [];
    doc.fontSize(12).text('Conditions:', { underline: true });
    if (conditions.length === 0) {
        doc.text('  None');
    } else {
        conditions.forEach(cond => {
            doc.text(`  ${cond.charAt(0).toUpperCase() + cond.slice(1)}`);
        });
    }
    doc.moveDown();
    doc.text('Abilities:');
    sheet.abilities.forEach(ab => {
        doc.text(`  ${ab.name}: ${ab.description}`);
    });
    doc.moveDown();
    doc.text('Notes:');
    doc.text(sheet.notes);
    doc.moveDown();

    // Add Spells section (for quick reference) at the end
    const spells = (sheet.spells && Array.isArray(sheet.spells)) ? sheet.spells : [];
    doc.fontSize(12).text('Spells:', { underline: true });
    if (spells.length === 0) {
        doc.text('  None');
    } else {
        spells.forEach(spell => {
            if (spell && spell.name) {
                doc.text(`  ${spell.name}`);
            }
        });
    }
    doc.moveDown();

    doc.end();
    stream.on('finish', () => {
        callback(null, pdfPath);
    });
    stream.on('error', err => {
        callback(err);
    });
}

module.exports = {
    characterSheetToPDF
};
