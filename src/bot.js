

require('dotenv').config();
const { Client, Intents } = require('discord.js');
const dice = require('./dice_command/dice');
const pdfIndexer = require('./search_command/pdfIndexer');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});



client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});
  const command = message.content.split(' ')[0].toLowerCase();

async function startBot() {
  console.log('Indexing rule PDFs...');
  await pdfIndexer.indexPDFs();
  console.log('PDF indexing complete. Starting bot...');

  client.on('messageCreate', async message => {
    if (message.author.bot) return;
    const args = message.content.split(' ').slice(1);
    const command = message.content.split(' ')[0].toLowerCase();

    // Dice rolling command
    if (command === '!roll') {
      if (!args[0]) {
        message.reply('Please provide dice notation, e.g., !roll 2d6+3');
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
    if (command === '!search') {
      if (!args[0]) {
        message.reply('Please provide a keyword to search for, e.g., !search stealth');
        return;
      }
      const results = pdfIndexer.searchKeyword(args[0]);
      if (results.length === 0) {
        message.reply(`No results found for "${args[0]}"`);
      } else {
        const reply = results.map(r => `**${r.file}** (Page ${r.page}): ...${r.snippet}...`).join('\n');
        message.reply(`Found ${results.length} result(s) for "${args[0]}":\n${reply}`);
      }
    }
  });

  client.login(process.env.DISCORD_BOT_TOKEN);
}

startBot();
