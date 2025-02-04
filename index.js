const { Client, Partials, Collection, GatewayIntentBits } = require('discord.js');
const config = require('./config/config');
const chalk = require('chalk');

// Creating a new client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [
    Partials.Channel,
    Partials.Message,
    Partials.User,
    Partials.GuildMember,
    Partials.Reaction
  ],
  presence: {
    activities: [{
      name: "all the users",
      type: 3
    }],
    status: 'dnd'
  }
});

// Getting the bot token
const AuthenticationToken = process.env.TOKEN || config.Client.TOKEN;
if (!AuthenticationToken) {
  console.warn(chalk.red("[CRASH] Authentication Token for Discord bot is required! Use Envrionment Secrets or config.js."))
  return process.exit();
};

// Handler:
client.prefix_commands = new Collection();
client.slash_commands = new Collection();
client.user_commands = new Collection();
client.events = new Collection();

module.exports = client;

["prefix", "application_commands", "events","mongoose","express", "check"].forEach((file) => {
  require(`./handlers/${file}`)(client, config);
});


// Login to the bot
client.login(AuthenticationToken)
  .catch((err) => {
    console.error("[CRASH] Something went wrong while connecting to your bot...");
    console.error("[CRASH] Error from Discord API:" + err);
    return process.exit();
});


// Handle errors
process.on('unhandledRejection', async (err, promise) => {
  console.error(chalk.red(`[ANTI-CRASH] Unhandled Rejection: ${err}`));
  console.error(promise);
});
