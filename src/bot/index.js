// This file is responsible for creating the client itself
const { Client } = require('discord.js');
const CommandHandler = require('../command-handler/CommandHandler');
const Logger = require('../Logger');
const config = require('../../config/discord.json');

const client = new Client();
client.logger = new Logger('[Discord]'.bold.blue);

// Load guild specific settings and start listening for commands
client.on('ready', () => {
	client.logger.info(`Logged in as ${client.user.tag} (${client.user.id})`);
	client.commandHandler = new CommandHandler(client, {
		prefix: config.prefix,
		owners: config.owners,
	});
	client.commandHandler.loadDefaults();
});

// Pass an arrow function to preserve this scope
client.on('message', msg => client.commandHandler.message(msg));

client.login(config.token)
	.catch(e => client.logger.fatal('Login error', e));

