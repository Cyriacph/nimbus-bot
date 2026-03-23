# Nimble Character Sheet Format

This document explains the structure and fields of the character sheet JSON required by the nimbus-bot. Use this as a reference when filling out or editing your character sheet.

## Template Structure

```
{
  "character_sheet": {
    "basic_details": {
      "character_name": "Your character's name",
      "ancestry": "Race or ancestry (e.g., Human, Elf)",
      "class": "Class (e.g., Warrior, Mage)",
      "level": 1,
      "height": "",
      "weight": "",
      "hit_dice": ""
    },
    "stats": {
      "strength": { "value": 0, "save": false },
      "dexterity": { "value": 0, "save": false },
      "intelligence": { "value": 0, "save": false },
      "will": { "value": 0, "save": false }
    },
    "hit_points": {
      "current": 0, "max": 0, "temp_hp": 0
    },
    "wounds": {
      "current": 0, "max": 0
    },
    "armor": {
      "base": 0, "modifier": 0
    },
    "initiative": {
      "base": 0, "modifier": 0
    },
    "speed": {
      "base": 0, "modifier": 0
    },
    "inventory_slots": {
      "total": 0, "used": 0
    },
    "skills": {
      "arcana": { "base": "intelligence", "bonus": 0 },
      "examination": { "base": "intelligence", "bonus": 0 },
      "finesse": { "base": "dexterity", "bonus": 0 },
      "influence": { "base": "will", "bonus": 0 },
      "insight": { "base": "will", "bonus": 0 },
      "lore": { "base": "intelligence", "bonus": 0 },
      "might": { "base": "strength", "bonus": 0 },
      "naturecraft": { "base": "intelligence", "bonus": 0 },
      "perception": { "base": "will", "bonus": 0 },
      "stealth": { "base": "dexterity", "bonus": 0 }
    },
    "equipment": [],
    "languages": [],
    "abilities": [],
    "notes": "",
    "conditions": [],
    "spells": []
  }
}
```

## Field Explanations

- **basic_details**: Core identity and background for your character.
- **stats**: Main attributes; each has a value and a save flag.
- **hit_points**: Tracks current, max, and temporary HP.
- **wounds**: Tracks current and max wounds.
- **armor**: Armor values.
- **initiative**: Initiative modifiers.
- **speed**: Movement speed modifiers.
- **inventory_slots**: Total and used inventory slots.
- **skills**: All skills must be present; each has a base stat and bonus.
- **equipment**: List of items carried.
- **languages**: Languages known.
- **abilities**: Special abilities or features.
- **notes**: Freeform notes or background.
- **conditions**: List of current conditions (e.g., poisoned, stunned).
- **spells**: List of known spells (can be empty).

See NimbleCharacterTemplate.json for a ready-to-use blank template.
