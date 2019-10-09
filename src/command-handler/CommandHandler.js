// CommandHandler parses messages and runs the required command
// It also provides some basic commands such as ping
const path = require('path');
require('colors');
const { Collection } = require('discord.js');
const Argument = require('./Argument');
const Command = require('./Command');
const CommandMessage = require('./CommandMessage');
const Logger = require('../Logger');
const Registry = require('./Registry');
const util = require('../utility');

const defaultOptions = {
	prefix: '!',
	owners: [],
};

class CommandHandler {
	constructor(client, options = defaultOptions) {
		this.client = client;
		this.logger = new Logger('[Commands]'.bold.blue);

		this._validateOptions(options);
		this._rawPrefix = options.prefix;
		this.globalPrefix = this.buildPrefix(this._rawPrefix);
		this.logger.info(`Built prefix ${this._rawPrefix} (${this.globalPrefix})`);
		this._owners = options.owners;

		// Regex used by the argument parser
		this.argumentRegex = /\s*(?:(["'])([^]*?)\1|(\S+))\s*/g;

		// Command and argument registries
		this.commands = new Registry(this.client, Command);
		this.arguments = new Registry(this.client, Argument);

		// Valid command modules
		this.modules = new Collection([
			['util', 'Utilities'],
		]);
	}

	// Build a regex prefix from a raw string
	buildPrefix(prefix) {
		const escapedPrefix = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		return new RegExp(`^(<@!?${this.client.user.id}>\\s+(?:${escapedPrefix}\\s*)?|${escapedPrefix}\\s*)([^\\s]+)`);
	}

	// Check if a message could be a command trigger
	// Parses and executes the command if it is
	message(message) {
		if (message.author.bot) return false;
		const prefix = this.globalPrefix; // Handle guild prefix changes here
		if (prefix.test(message.content)) {
			const msg = new CommandMessage(this.client, message, prefix);
			const status = msg.getStatus();
			switch (status) {
				case -3:
					// Not a command, do nothing
					return false;
				case -2:
					this.logger.warn('Command parsed but did not change status - this should be impossible');
					msg.reject('This should never occur');
					return false;
				case -1:
					this.logger.debug(`Running command ${msg.command.display} (${msg.content})`);
					msg.run();
					return true;
				case 0:
					this.logger.warn(`Command completed before execution (status ${status}) - this should be impossible`);
					msg.reject('This should never occur');
					return false;
				// If status > 0 then the command was rejected by the argument parser
			}
		}
		return false;
	}

	// Check if a user is the owner
	isOwner(id) {
		return this._owners.includes(id);
	}

	// Setup registries with default commands and argument types
	loadDefaults() {
		this.commands.registerDirectory(path.join(__dirname, './commands'));
		this.arguments.registerDirectory(path.join(__dirname, './arguments'));
	}

	// Validate arguments given to the command handler
	_validateOptions(options) {
		// Prefix
		const prefix = options.prefix;
		if (!prefix || typeof prefix !== 'string') {
			this.logger.fatal('Command prefix is not a string', typeof prefix);
		}

		// Owners
		const owners = options.owners;
		if (!owners || !Array.isArray(owners)) {
			this.logger.fatal('Bot owners is not an array', typeof owners);
		}
		if (!owners.every(owner => util.isId(owner))) {
			this.logger.fatal('Bot owners are not valid user ids', owners);
		}
		if (owners.length === 0) {
			this.logger.warn('Bot has no owners');
		}

		this.logger.debug('Command handler options validated');
	}
}

module.exports = CommandHandler;

