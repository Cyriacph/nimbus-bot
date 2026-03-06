

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
  client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
  });

  client.on('messageCreate', async message => {
    console.log(`Received message: '${message.content}' from ${message.author.tag} in #${message.channel.name}`);
    if (message.author.bot) return;
    if (!message.content || message.content.trim() === '') return;
    const args = message.content.split(' ').slice(1);
    const command = message.content.split(' ')[0].toLowerCase();
    console.log(`Parsed command: '${command}', args: ${args}`);

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
      const results = searchRules.searchKeyword(args[0]);
      if (results.length === 0) {
        message.reply(`No results found for "${args[0]}"`);
      } else {
        const reply = results.map(r => `**${r.file}** (Page ${r.page}): ...${r.snippet}...`).join('\n');
        message.reply(`Found ${results.length} result(s) for "${args[0]}":\n${reply}`);
      }
    }
  });

  client.login(process.env.DISCORD_TOKEN);
}

startBot();