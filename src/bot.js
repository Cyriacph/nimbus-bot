require("dotenv").config();
// Enable Discord.js debug output
process.env.DEBUG = "discord.js:*";
const { Client, GatewayIntentBits } = require("discord.js");
const dice = require("./commands/rollDice");
const searchRules = require("./commands/searchRules");
const { COMMANDS, USAGE } = require("./constants/commands");
const { SEARCH_USAGE } = require("./constants/search");
const characterSheetUtils = require("./utils/characterSheetUtils");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Listen for all Discord.js debug events
client.on("debug", (info) => console.log("[DEBUG]", info));
client.on("warn", (info) => console.log("[WARN]", info));
client.on("error", (error) => console.error("[ERROR]", error));

client.on("ready", () => console.log(`Logged in as ${client.user.tag}`));

function startBot() {
  // Initialize the dictionary index for rule search
  searchRules.indexJsonDictionaries();

  client.once("ready", () => console.log(`Logged in as ${client.user.tag}`));

  client.on("messageCreate", async (message) => {
    console.log(
      `Received message: '${message.content}' from ${message.author.tag} in #${message.channel.name}`,
    );
    if (message.author.bot) return;
    if (!message.content || message.content.trim() === "") return;

    const args = message.content.split(" ").slice(1);
    const command = message.content.split(" ")[0].toLowerCase();
    console.log(`Parsed command: '${command}', args: ${args}`);

    switch (command) {
      case COMMANDS.ADD: {
        if (!args[0]) {
          message.reply(USAGE.ADD);
          return;
        }
        const characterName = args[0];
        if (!message.attachments || message.attachments.size === 0) {
          message.reply("Please attach a file containing JSON.");
          return;
        }
        const attachment = message.attachments.first();
        const fetch = require("node-fetch");
        fetch(attachment.url)
          .then((res) => res.text())
          .then((data) => {
            let sheet;
            try {
              sheet = JSON.parse(data);
            } catch (err) {
              message.reply("Invalid JSON format.");
              return;
            }
            const { storeCharacterSheet } = require("./commands/storeSheet");
            try {
              const filePath = storeCharacterSheet(characterName, sheet);
              message.reply(
                `Character sheet for '${characterName}' added successfully.`,
              );
            } catch (err) {
              message.reply(`Error storing character sheet: ${err.message}`);
            }
          })
          .catch(() => {
            message.reply("Failed to download the attachment.");
          });
        break;
      }

      case COMMANDS.FETCH: {
        if (!args[0]) {
          message.reply(USAGE.FETCH);
          return;
        }
        const characterName = args[0];
        const { fetchCharacterSheet } = require("./commands/fetchSheet");
        try {
          const jsonPath = fetchCharacterSheet(characterName);
          message.reply({
            content: `JSON for '${characterName}' fetched.`,
            files: [jsonPath],
          });
        } catch (err) {
          message.reply(`Error fetching JSON: ${err.message}`);
        }
        break;
      }

      case COMMANDS.READ: {
        if (!args[0]) {
          message.reply("Usage: !read <characterName>");
          return;
        }
        const characterName = args[0];
        const {
          characterSheetToPDF,
        } = require("./commands/characterSheetToPDF");
        characterSheetToPDF(characterName, (err, pdfPath) => {
          if (err) {
            message.reply(`Error generating PDF: ${err.message}`);
            return;
          }
          message.reply({
            content: `PDF for '${characterName}' generated.`,
            files: [pdfPath],
          });
        });
        break;
      }

      case COMMANDS.ROLL: {
        if (!args[0]) {
          message.reply(USAGE.ROLL);
          return;
        }
        try {
          const result = dice.roll(args[0]);
          let reply = `You rolled ${result.numDice}d${result.numFaces}`;
          if (result.modifier !== 0)
            reply += (result.modifier > 0 ? "+" : "") + result.modifier;
          reply += `: [${result.rolls.join(", ")}]`;
          if (result.modifier !== 0)
            reply += ` ${result.modifier > 0 ? "+" : "-"} ${Math.abs(result.modifier)}`;
          reply += `\nTotal: ${result.total}`;
          message.reply(reply);
        } catch (err) {
          if (err.name && err.message)
            message.reply(`Error [${err.name}]: ${err.message}`);
          else message.reply(`Error: ${err}`);
        }
        break;
      }

      case COMMANDS.SEARCH: {
        if (!args[0]) {
          message.reply(SEARCH_USAGE);
          return;
        }
        const results = searchRules.searchDictionary(args[0]);
        if (results.length === 0)
          message.reply(`No results found for "${args[0]}"`);
        else {
          const reply = results
            .map((r) => `**${r.word}**: ${r.definition}`)
            .join("\n");
          message.reply(
            `Found ${results.length} result(s) for "${args[0]}":\n${reply}`,
          );
        }
        break;
      }

      case COMMANDS.SKILLCHECK: {
        if (!args[0] || !args[1]) {
          message.reply(USAGE.SKILLCHECK);
          return;
        }
        const characterName = args[0];
        const skillName = args[1];
        const { skillCheck } = require("./commands/skillcheck");
        try {
          const result = skillCheck(characterName, skillName);
          message.reply(
            `Skillcheck for '${characterName}' (${skillName}):\nRoll: ${result.roll}\nSkill Value: ${result.skillValue}\nTotal: ${result.total}`,
          );
        } catch (err) {
          message.reply(`Error: ${err.message}`);
        }
      }
      case COMMANDS.MAX_HP: {
        if (args.length < 2) {
          message.reply(USAGE.MAX_HP);
          return;
        }
        const characterName = args[0];
        const value = parseInt(args[1]);
        if (isNaN(value)) {
          message.reply('Value must be a number.');
          return;
        }
        const { maxHP } = require('./commands/maxHP');
        try {
          const newMaxHP = maxHP(characterName, value);
          message.reply(`Updated max HP for '${characterName}' to ${value}`);
        } catch (err) {
          message.reply(`Error updating max HP: ${err.message}`);
        }
        break;
      }
      case COMMANDS.STORE: {
        if (!args[0]) {
          message.reply("Usage: !store <characterName> <characterSheetJSON>");
          return;
        }
        const characterName = args[0];
        const jsonString = args.slice(1).join(" ");
        let sheet;
        try {
          sheet = JSON.parse(jsonString);
        } catch (err) {
          message.reply("Invalid JSON format for character sheet.");
          return;
        }
        try {
          const { storeCharacterSheet } = require("./commands/storeSheet");
          const filePath = storeCharacterSheet(characterName, sheet);
          message.reply(
            `Character sheet for '${characterName}' stored successfully at ${filePath}`,
          );
        } catch (err) {
          message.reply(`Error storing character sheet: ${err.message}`);
        }
        break;
      }

      case COMMANDS.ADD_HP: {
        if (args.length < 2) {
          message.reply(USAGE.ADD_HP);
          return;
        }
        const characterName = args[0];
        const value = parseInt(args[1]);
        if (isNaN(value)) {
          message.reply("Value must be a number.");
          return;
        }
        const { addHP } = require("./commands/addHP");
        try {
          console.log(`Updating HP for '${characterName}' by ${value}`);
          const newHP = addHP(characterName, value);
          message.reply(`Updated HP for '${characterName}'. New HP: ${newHP}`);
        } catch (err) {
          message.reply(`Error updating HP: ${err.message}`);
        }
        break;
      }
        
      case COMMANDS.SET_STATS: {
          if (args.length < 3) {
            message.reply(USAGE.SET_STATS);
            return;
          }
          const characterName = args[0];
          const stat = args[1];
          const value = args[2];
          const { setStats } = require('./commands/setStats');
          try {
            const newValue = setStats(characterName, stat, value);
            message.reply(`Updated '${stat}' for '${characterName}' to ${newValue}.`);
          } catch (err) {
            message.reply(`Error updating stat: ${err.message}`);
          }
          break;
      }

      case COMMANDS.INITIATIVE: {
        if (args.length < 1) {
          message.reply(USAGE.INITIATIVE);
          return;
        }
        const characterName = args[0];
        const { initiative } = require('./commands/initiative');
        try {
          const result = initiative(characterName);
          message.reply(
            `Initiative for '${characterName}':\nRoll: ${result.rolls[0]}\nDexterity Modifier: ${result.modifier}\nTotal Initiative: ${result.total}`);
        } catch (err)  {
          message.reply(`Error rolling initiative: ${err.message}`);
        }
        break;
      } 

      default:
        // Optionally handle unknown commands
        break;
    }
  });

  client.login(process.env.DISCORD_TOKEN);
  if (!process.env.DISCORD_TOKEN) {
    console.error("[ERROR] DISCORD_TOKEN is not set in environment variables.");
  } else {
    console.log("[INFO] DISCORD_TOKEN is set.");
  }
}

startBot();
