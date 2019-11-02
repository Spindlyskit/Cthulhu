// Say echos the text from the arguments
const Command = require('../Command');

class SayCommand extends Command {
	constructor(client) {
		super(client, 'say', {
			description: 'Say the text specifed in the first argument',
			module: 'util',
			args: [
				{
					name: 'text',
					type: 'string',
				},
			],
		});
	}

	// Run the command
	run(msg, { text }) {
		msg.resolve(text);
	}
}

module.exports = SayCommand;

