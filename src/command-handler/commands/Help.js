// Help displays information about all of the bots commands
const { stripIndents } = require('common-tags');
const Command = require('../Command');
const { format } = require('../../utility/chat');

class HelpCommand extends Command {
	constructor(client) {
		super(client, 'help', {
			description: 'Display information about available commands',
			module: 'util',
			args: [
				{
					name: 'command',
					type: 'command',
					default: null,
				},
			],
		});
	}

	run(msg, { command }) {
		if (command !== null) {
			msg.resolve(this.generateHelpFor(msg, command));
		} else {
			msg.resolve(this.generateHelpText(msg));
		}
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

	// Generate text showing specific information about a single command
	generateHelpFor(msg, command) {
		return stripIndents`
		${format.bold(format.underline(command.name))} ${command.description}

		${format.bold('Module:')} ${format.code(command.module || 'unknown')}
		${format.bold('Format:')} ${format.code(command.name + command.format)}
		${format.bold('Aliases:')} ${format.code(command.aliases.length > 0 ? command.aliases.join(', ') : 'None')}
		${format.bold('Examples:')} ${format.codeblock(command.examples ? command.examples.join('\n') : 'None', 'sh')}
		${command.ownerOnly ? format.bold('Bot admin only!') : ''}
		`;
	}
}

module.exports = HelpCommand;

