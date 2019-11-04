const { stripIndents } = require('common-tags');
const { Collection } = require('discord.js');
const { format } = require('../utility/chat');

// HelpProvider provides methods for getting general help and help about a specific command
class HelpProvider {
	constructor(commandHandler) {
		// The commandHandler that instantiated this help provider
		this.commandHandler = commandHandler;
		this.client = commandHandler.client;
		this.logger = commandHandler.logger;

		// Used for caching results of generate help calls
		this._generalHelpCache = null;
		this._commandHelpCache = new Collection();
	}

	// Get help explaining how to run commands with a list of available commands
	getGeneralHelp(regenerate = false) {
		if (regenerate) this._generalHelpCache = null;
		if (this._generalHelpCache) {
			this.logger.trace(`Not generating general help - cache exists`);
			return this._generalHelpCache;
		}

		const { client, commandHandler } = this;

		this.logger.debug(`(re)generating help`);

		// Indent rules make this code far too difficult to follow
		// It probably needs cleaning up at some point
		/* eslint-disable indent */
		this._generalHelpCache = stripIndents`
		To run a command in any server, use \`@${client.user.tag} command\`. For example, \`@${client.user.tag} help\`.

		Use \`help <\Command>\` to view detailed information about a specified command.
		${commandHandler.modules.keyArray().map(id => {
			const name = commandHandler.modules.get(id);
			const commands = commandHandler.commands.filter(e => e.module === id);
			return `
				__${name}__
				${commands.map(e => `**${e.name}:** ${e.description}`
			).join('\n')}
				`;
		}).join('')}
		`;
		/* eslint-enable indent */
		return this._generalHelpCache;
	}

	// Get detailed help about a specified command
	// Includes syntax, aliases and examples
	getHelpFor(command, regenerate = false) {
		const name = command.name;
		if (this._commandHelpCache.has(name) && !regenerate) {
			this.logger.trace(`Not generating help for ${command.name} - cache exists`);
			return this._commandHelpCache.get(name);
		}

		this.logger.debug(`(re)generating help for command ${command.name}`);

		const help = stripIndents`
		${format.bold(format.underline(command.name))} ${command.description}

		${format.bold('Module:')} ${format.code(command.module || 'unknown')}
		${format.bold('Format:')} ${format.code(command.name + command.format)}
		${format.bold('Aliases:')} ${format.code(command.aliases.length > 0 ? command.aliases.join(', ') : 'None')}
		${format.bold('Examples:')} ${format.codeblock(command.examples ? command.examples.join('\n') : 'None', 'sh')}
		${command.ownerOnly ? format.bold('Bot admin only!') : ''}
		`;

		this._commandHelpCache.set(name, help);
		return help;
	}

	// Check if general help has been cached
	hasGeneralHelpCache() {
		return !!this._generalHelpCache;
	}
}

module.exports = HelpProvider;

