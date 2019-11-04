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
		const helpProvider = msg.commandHandler.helpProvider;
		if (command !== null) {
			msg.resolve(helpProvider.getHelpFor(command));
		} else {
			msg.resolve(helpProvider.getGeneralHelp());
		}
	}

	// Generate text showing the name and description of available commands
	generateHelpText(msg) {
		const client = msg.client;
		const commandHandler = client.commandHandler;
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

