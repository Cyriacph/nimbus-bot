# nimbus-bot

Simple Discord bot for the Nimble TTRPG.

## What is this?

This is a Discord bot designed to help you play the Nimble TTRPG. It provides commands for dice rolling, character sheet management, spell lookup, and more.

## How to Use This Bot

You can run this bot on your own Discord server. The bot responds to commands in any channel it has access to. Example commands include:

- `!roll 2d6+3` — Roll dice
- `!addspell Fireball` — Add a spell to your character
- `!searchrule advantage` — Search the rules for a keyword
- `!fetchsheet` — Fetch your character sheet

For a full list of commands, see the `src/commands/` folder or use the help command (if implemented).


## Command Reference

Below is a list of all commands supported by the bot:

| Command | Description | Usage |
|---------|-------------|-------|
| `!roll` | Roll dice using standard notation. | `!roll 2d6+3` |
| `!search` | Search the rules for a keyword. | `!search stealth` |
| `!fetch` | Download your character sheet as a JSON file. | `!fetch <characterName>` |
| `!add` | Add a character sheet by uploading a JSON file. | `!add <characterName>` (attach JSON) |
| `!addhp` | Add or subtract HP from a character. | `!addhp <characterName> <value>` |
| `!skillcheck` | Roll a skill check for a character. | `!skillcheck <characterName> <skillName>` |
| `!read` | Generate a PDF from a character sheet. | `!read <characterName>` |
| `!store` | Store a character sheet from JSON text. | `!store <characterName> <characterSheetJSON>` |
| `!setstats` | Set a stat value for a character. | `!setstats <characterName> <stat> <value>` |
| `!maxhp` | Set the maximum HP for a character. | `!maxhp <characterName> <value>` |
| `!damage` | Deal damage to a character. | `!damage <characterName> <amount>` |
| `!heal` | Heal a character. | `!heal <characterName> <amount>` |
| `!wound` | Inflict wounds on a character. | `!wound <characterName> <amount>` |
| `!upskill` | Increase a skill bonus for a character. | `!upskill <characterName> <skillName>` |
| `!initiative` | Roll initiative for a character. | `!initiative <characterName>` |
| `!condition` | Toggle a condition for a character. | `!condition <characterName> <condition_name>` |
| `!allspells` | Export all spells to a PDF. | `!allspells` |
| `!searchspell` | Search for a spell by name. | `!searchspell <spell name>` |
| `!addspell` | Add a spell to a character sheet. | `!addspell <characterName> <spellName>` |
| `!myspells` | List all spells a character knows. | `!myspells <characterName>` |
| `!removespell` | Remove a spell from a character sheet. | `!removespell <characterName> <spellName>` |

**Notes:**
- For commands that require a character sheet, the character must already exist in the `character_sheets/` directory.
- Some commands require you to attach a JSON file or provide valid JSON as an argument.

---

## Running the Bot Locally

Follow these steps to run the bot on your own machine:

### 1. Clone the Repository

```bash
git clone <repo-url>
cd nimbus-bot
```

### 2. Install Dependencies

Make sure you have [Node.js](https://nodejs.org/) installed (v16 or higher recommended).

```bash
npm install
```

### 3. Configure the Bot Token

Create a `.env` file in the root directory with your Discord bot token:

```
DISCORD_TOKEN=your-bot-token-here
```

Replace `your-bot-token-here` with your actual Discord bot token.

### 4. Run the Bot

```bash
node src/bot.js
```

You should see a message like `Logged in as <botname>` if the bot started successfully.

### 5. Invite the Bot to Your Server

If you haven't already, invite your bot to your Discord server using the OAuth2 URL from the Discord Developer Portal.

## Troubleshooting

- Make sure your bot token is correct and the bot has permission to read/send messages in your server.
- Check the console for errors if the bot does not start.

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

MIT
