
require('dotenv').config();
const { Client, Intents } = require('discord.js');
const dice = require('./dice');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});


client.on('messageCreate', message => {
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
});

client.login(process.env.DISCORD_BOT_TOKEN);
