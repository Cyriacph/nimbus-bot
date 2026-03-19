const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');


// Constants for file structure and section headers
const CHARACTER_SHEET_DIR = path.join(__dirname, '..', '..', 'character_sheets');
const PDF_OUTPUT_DIR = path.join(CHARACTER_SHEET_DIR, 'pdf');
const FILE_EXTENSION = '.json';
const PDF_EXTENSION = '.pdf';

const SECTION_HEADERS = {
    CHARACTER_SHEET: 'Character Sheet',
    ANCESTRY: 'Ancestry',
    CLASS: 'Class',
    LEVEL: 'Level',
    HEIGHT: 'Height',
    WEIGHT: 'Weight',
    HIT_DICE: 'Hit Dice',
    HP: 'HP',
    WOUNDS: 'Wounds',
    ARMOR: 'Armor',
    INITIATIVE: 'Initiative',
    SPEED: 'Speed',
    INVENTORY_SLOTS: 'Inventory Slots',
    STATS: 'Stats:',
    SKILLS: 'Skills:',
    EQUIPMENT: 'Equipment:',
    LANGUAGES: 'Languages:',
    CONDITIONS: 'Conditions:',
    ABILITIES: 'Abilities:',
    NOTES: 'Notes:',
    SPELLS: 'Spells:'
};

function characterSheetToPDF(characterName, callback) {
    // Utility: safely get nested or top-level property
    function getSpells(data) {
        if (data.character_sheet && Array.isArray(data.character_sheet.spells) && data.character_sheet.spells.length > 0) {
            return data.character_sheet.spells;
        }
        if (Array.isArray(data.spells) && data.spells.length > 0) {
            return data.spells;
        }
        return [];
    }

    const safeName = characterName.replace(/[^a-zA-Z0-9_-]/g, '_');
    const jsonPath = path.join(CHARACTER_SHEET_DIR, `${safeName}${FILE_EXTENSION}`);
    if (!fs.existsSync(jsonPath)) {
        callback(new Error(`No character sheet found for '${characterName}'.`));
        return;
    }
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const sheet = data.character_sheet;
    if (!fs.existsSync(PDF_OUTPUT_DIR)) {
        fs.mkdirSync(PDF_OUTPUT_DIR);
    }
    const pdfPath = path.join(PDF_OUTPUT_DIR, `${safeName}${PDF_EXTENSION}`);
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);

    // Basic Details
    doc.fontSize(18).text(`${SECTION_HEADERS.CHARACTER_SHEET}: ${sheet.basic_details.character_name}`, { underline: true });
    doc.moveDown();
    doc.fontSize(12);
    [
        [SECTION_HEADERS.ANCESTRY, sheet.basic_details.ancestry],
        [SECTION_HEADERS.CLASS, sheet.basic_details.class],
        [SECTION_HEADERS.LEVEL, sheet.basic_details.level],
        [SECTION_HEADERS.HEIGHT, sheet.basic_details.height],
        [SECTION_HEADERS.WEIGHT, sheet.basic_details.weight],
        [SECTION_HEADERS.HIT_DICE, sheet.basic_details.hit_dice],
    ].forEach(([label, value]) => doc.text(`${label}: ${value}`));
    doc.moveDown();
    doc.text(`${SECTION_HEADERS.HP}: ${sheet.hit_points.current}/${sheet.hit_points.max} (Temp: ${sheet.hit_points.temp_hp})`);
    doc.text(`${SECTION_HEADERS.WOUNDS}: ${sheet.wounds.current}/${sheet.wounds.max}`);
    doc.text(`${SECTION_HEADERS.ARMOR}: ${sheet.armor}`);
    doc.text(`${SECTION_HEADERS.INITIATIVE}: ${sheet.initiative}`);
    doc.text(`${SECTION_HEADERS.SPEED}: ${sheet.speed}`);
    doc.text(`${SECTION_HEADERS.INVENTORY_SLOTS}: ${sheet.inventory_slots.used}/${sheet.inventory_slots.total}`);
    doc.moveDown();

    // Stats
    doc.text(SECTION_HEADERS.STATS);
    Object.entries(sheet.stats).forEach(([stat, val]) => {
        doc.text(`  ${stat.charAt(0).toUpperCase() + stat.slice(1)}: ${val.value} (Save: ${val.save})`);
    });
    doc.moveDown();

    // Skills
    doc.text(SECTION_HEADERS.SKILLS);
    Object.entries(sheet.skills).forEach(([skill, skillObj]) => {
        const statName = skillObj.base;
        const statValue = sheet.stats[statName]?.value ?? 0;
        const bonus = skillObj.bonus ?? 0;
        const skillValue = statValue + bonus;
        doc.text(`  ${skill.charAt(0).toUpperCase() + skill.slice(1)}: ${skillValue}`);
    });
    doc.moveDown();

    // Equipment
    doc.text(SECTION_HEADERS.EQUIPMENT);
    (sheet.equipment || []).forEach(item => {
        doc.text(`  ${item.name} (${item.type}) - ${item.properties} ${item.damage ? 'Damage: ' + item.damage : ''}`);
    });
    doc.moveDown();

    // Languages
    doc.text(`${SECTION_HEADERS.LANGUAGES} ${(sheet.languages || []).join(', ')}`);
    doc.moveDown();

    // Conditions (names only)
    const conditions = sheet.conditions || [];
    doc.fontSize(12).text(SECTION_HEADERS.CONDITIONS, { underline: true });
    if (conditions.length === 0) {
        doc.text('  None');
    } else {
        conditions.forEach(cond => {
            doc.text(`  ${cond.charAt(0).toUpperCase() + cond.slice(1)}`);
        });
    }
    doc.moveDown();

    // Abilities
    doc.text(SECTION_HEADERS.ABILITIES);
    (sheet.abilities || []).forEach(ab => {
        doc.text(`  ${ab.name}: ${ab.description}`);
    });
    doc.moveDown();

    // Notes
    doc.text(SECTION_HEADERS.NOTES);
    doc.text(sheet.notes || '');
    doc.moveDown();

    // Spells (always at the end)
    const spells = getSpells(data);
    doc.fontSize(12).text(SECTION_HEADERS.SPELLS, { underline: true });
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
    stream.on('finish', () => callback(null, pdfPath));
    stream.on('error', err => callback(err));
}

module.exports = {
    characterSheetToPDF
};
