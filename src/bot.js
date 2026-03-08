

require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const dice = require('./commands/rollDice');
const searchRules = require('./commands/searchRules');
const { COMMANDS, USAGE } = require('./constants/commands');
const { SEARCH_USAGE } = require('./constants/search');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});




function startBot() {
  // Initialize the dictionary index for rule search
  searchRules.indexJsonDictionaries();

  client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
  });

    client.on('messageCreate', async message => {
            // Add character sheet JSON via attachment
            if (command === COMMANDS.ADD) {
              if (!args[0]) {
                message.reply(USAGE.ADD);
                return;
              }
              const characterName = args[0];
              if (!message.attachments || message.attachments.size === 0) {
                message.reply('Please attach a JSON file.');
                return;
              }
              const attachment = message.attachments.first();
              if (!attachment.name.endsWith('.json')) {
                message.reply('Only .json files are accepted.');
                return;
              }
              // Download the file
              const fetch = require('node-fetch');
              fetch(attachment.url)
                .then(res => res.text())
                .then(data => {
                  let sheet;
                  try {
                    sheet = JSON.parse(data);
                  } catch (err) {
                    message.reply('Invalid JSON format.');
                    return;
                  }
                  const { storeCharacterSheet } = require('./commands/storeSheet');
                  try {
                    const filePath = storeCharacterSheet(characterName, sheet);
                    message.reply(`Character sheet for '${characterName}' added successfully.`);
                  } catch (err) {
                    message.reply(`Error storing character sheet: ${err.message}`);
                  }
                })
                .catch(() => {
                  message.reply('Failed to download the attachment.');
                });
            }
      console.log(`Received message: '${message.content}' from ${message.author.tag} in #${message.channel.name}`);
      if (message.author.bot) return;
      if (!message.content || message.content.trim() === '') return;
      const args = message.content.split(' ').slice(1);
      const command = message.content.split(' ')[0].toLowerCase();
      console.log(`Parsed command: '${command}', args: ${args}`);

      // Fetch and send character sheet JSON command
      if (command === COMMANDS.FETCH) {
        if (!args[0]) {
          message.reply(USAGE.FETCH);
          return;
        }
        const characterName = args[0];
        const { fetchCharacterSheet } = require('./commands/fetchSheet');
        try {
          const jsonPath = fetchCharacterSheet(characterName);
          message.reply({ content: `JSON for '${characterName}' fetched.`, files: [jsonPath] });
        } catch (err) {
          message.reply(`Error fetching JSON: ${err.message}`);
        }
      }

      // Generate and send character sheet PDF command
      if (command === '!read') {
        if (!args[0]) {
          message.reply('Usage: !read <characterName>');
          return;
        }
        const characterName = args[0];
        const { characterSheetToPDF } = require('./commands/characterSheetToPDF');
        characterSheetToPDF(characterName, (err, pdfPath) => {
          if (err) {
            message.reply(`Error generating PDF: ${err.message}`);
            return;
          }
          message.reply({ content: `PDF for '${characterName}' generated.`, files: [pdfPath] });
        });
      }
      console.log(`Received message: '${message.content}' from ${message.author.tag} in #${message.channel.name}`);
      if (message.author.bot) return;
      if (!message.content || message.content.trim() === '') return;
      // ...existing code...

      // Dice rolling command
      if (command === COMMANDS.ROLL) {
        if (!args[0]) {
          message.reply(USAGE.ROLL);
          return;
        }
        try {
          const result = dice.roll(args[0]);
          let reply = `You rolled ${result.numDice}d${result.numFaces}`;
          if (result.modifier !== 0) {
            reply += (result.modifier > 0 ? '+' : '') + result.modifier;
          }
          reply += `: [${result.rolls.join(', ')}]`;
          if (result.modifier !== 0) {
            reply += ` ${result.modifier > 0 ? '+' : '-'} ${Math.abs(result.modifier)}`;
          }
          reply += `\nTotal: ${result.total}`;
          message.reply(reply);
        } catch (err) {
          if (err.name && err.message) {
            message.reply(`Error [${err.name}]: ${err.message}`);
          } else {
            message.reply(`Error: ${err}`);
          }
        }
      }
      // Rule search command
      if (command === COMMANDS.SEARCH) {
        if (!args[0]) {
          message.reply(SEARCH_USAGE);
          return;
        }
        const results = searchRules.searchDictionary(args[0]);
        if (results.length === 0) {
          message.reply(`No results found for "${args[0]}"`);
        } else {
          const reply = results.map(r => `**${r.word}**: ${r.definition}`).join('\n');
          message.reply(`Found ${results.length} result(s) for "${args[0]}":\n${reply}`);
        }
      }

      // Store character sheet command
      if (command === '!store') {
        if (!args[0]) {
          message.reply('Usage: !store <characterName> <characterSheetJSON>');
          return;
        }
        const characterName = args[0];
        const jsonString = args.slice(1).join(' ');
        let sheet;
        try {
          sheet = JSON.parse(jsonString);
        } catch (err) {
          message.reply('Invalid JSON format for character sheet.');
          return;
        }
        try {
          const { storeCharacterSheet } = require('./commands/storeSheet');
          const filePath = storeCharacterSheet(characterName, sheet);
          message.reply(`Character sheet for '${characterName}' stored successfully at ${filePath}`);
        } catch (err) {
          message.reply(`Error storing character sheet: ${err.message}`);
        }
      }

      // Retrieve character sheet info command
      if (command === '!character') {
        if (!args[0]) {
          message.reply('Usage: !character <characterName>');
          return;
        }
        const characterName = args[0];
        const safeName = characterName.replace(/[^a-zA-Z0-9_-]/g, '_');
        const filePath = require('path').join(__dirname, '..', 'character_sheets', `${safeName}.json`);
        const fs = require('fs');
        if (!fs.existsSync(filePath)) {
          message.reply(`No character sheet found for '${characterName}'.`);
          return;
        }
        try {
          const sheet = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          const info = sheet.character_sheet;
          let reply = `**Character Name:** ${info.basic_details.character_name}\n`;
          reply += `**Ancestry:** ${info.basic_details.ancestry}\n`;
          reply += `**Class:** ${info.basic_details.class}\n`;
          reply += `**Level:** ${info.basic_details.level}\n`;
          reply += `**HP:** ${info.hit_points.current}/${info.hit_points.max}\n`;
          reply += `**Wounds:** ${info.wounds.current}/${info.wounds.max}`;
          message.reply(reply);
        } catch (err) {
          message.reply(`Error reading character sheet: ${err.message}`);
        }
      }
    });

  client.login(process.env.DISCORD_TOKEN);
}

startBot();