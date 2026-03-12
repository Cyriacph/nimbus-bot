/**
 * Command: !condition
 * Adds or removes a condition from a player and displays its effects.
 */

const CONDITIONS_DB = {
    "blinded": "Can't see. Attacks against you have advantage, and your attacks have disadvantage.",
    "bloodied": "At half HP or less.",
    "charmed": "Sees the charmer as an ally. Charmer has advantage on social interactions with you.",
    "dazed": "Heroes: lose 1 action; monsters: can perform one less action on their next turn.",
    "dying": "At 0 HP. Taking damage while dying causes 2 Wounds, a crit causes 3 instead.",
    "frightened": "Disadvantage on rolls when source of fear is nearby; speed halved when moving closer to it.",
    "grappled": "Cannot move. Attacks against you have advantage.",
    "restrained": "Cannot move. Attacks against you have advantage.",
    "hampered": "Any creature with their actions or movement reduced (e.g., Dazed, Grappled, Prone, Difficult Terrain).",
    "incapacitated": "Can't do anything. Attacks against you have advantage, and melee attacks that hit, crit.",
    "invisible": "Cannot be seen. Your attacks have advantage, and attacks against you have disadvantage.",
    "petrified": "Incapacitated. You have all the benefits and drawbacks of being a rock! Immune to most damage except from large explosions, picks, or similar tools.",
    "poisoned": "Disadvantage on rolls.",
    "prone": "Movement costs twice as much, and disadvantage on attacks. Melee attacks against you have advantage; Ranged have disadvantage. Spend 3 spaces of your Speed to stand up.",
    "riding": "You move with the creature you are riding. Any attacks that miss you, strike them.",
    "slowed": "Speed halved during your next turn.",
    "taunted": "Disadvantage on attacks except against the most recent taunter.",
    "wounded": "Has any Wounds (typically 6 Wounds and a hero is dead).",
    "minor": "Minor statuses (Smoldering, Charged, Distracted, etc.) do nothing on their own and end whenever combat does. Some spells and abilities have additional effects against such targets."
};


const players = {};


function handleConditionCommand(args) {
    if (args.length < 2) {
        return "Usage: !condition <player_name> <condition_name>";
    }

    const playerName = args[0].toLowerCase();
    const conditionName = args.slice(1).join(" ").toLowerCase();
    if (!players[playerName]) {
        players[playerName] = { name: args[0], conditions: [] };
    }
    
    const player = players[playerName];
    const conditionDesc = CONDITIONS_DB[conditionName];
    const displayCondition = conditionName.charAt(0).toUpperCase() + conditionName.slice(1);
    const conditionIndex = player.conditions.indexOf(conditionName);
    
    if (conditionIndex > -1) {
        player.conditions.splice(conditionIndex, 1);
        return `Removed condition **${displayCondition}** from ${player.name}.`;
    } else {
        player.conditions.push(conditionName);
        
        let response = `Added condition **${displayCondition}** to ${player.name}.`;
        
        if (conditionDesc) {
            response += `\n> *${conditionDesc}*`;
        } else {
            response += `\n> *(Custom or Minor status)*`;
        }
        
        return response;
    }
}

module.exports = {
    CONDITIONS_DB,
    handleConditionCommand
};
