// Help displays information about all of the bots commands
const Command = require('../Command');

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
}

module.exports = HelpCommand;

