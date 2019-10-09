// Help displays information about all of the bots commands
const { stripIndents } = require('common-tags');
const Command = require('../Command');

class HelpCommand extends Command {
	constructor(client) {
		super(client, 'help', {
			description: 'Display information about available commands',
			module: 'util',
			// This should take an optional command as an argument
		});
	}

	run(msg) {
		msg.resolve(this.generateHelpText(msg));
	}

	// Generate text showing the name and description of available commands
	generateHelpText(msg) {
		const client = msg.client;
		const commandHandler = client.commandHandler;
		return stripIndents`
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
	}
}

module.exports = HelpCommand;

