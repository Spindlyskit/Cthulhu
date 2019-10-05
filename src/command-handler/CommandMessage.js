const { oneline } = require('common-tags');

// CommandMessage represents a message which triggers a command
class CommandMessage {
	constructor(client, message, prefix) {
		this.client = client;
		this.commandHandler = client.commandHandler;
		this.logger = this.commandHandler.logger;

		// The discordjs.Message this message was built from
		this.message = message;

		// The prefix that this command was parsed with
		this.prefix = prefix;

		// Represents the completion status of the command
		//  -3 - Parsed, not a command
		//  -2 - Parsing
		//  -1 - Running
		//  0  - Complete, no errors
		//  1  - Complete, user error (invalid syntax)
		//  2  - Complete, permissions error (user cannot run command)
		//  3  - Complete, client permission error (client cannot complete action)
		//  4  - Complete, execution error (run function threw error)
		this._status = -2;

		// The command that this message represents
		this.command = null;
		this._parseCommand(prefix);
	}

	// Complete the command with a success message and exit status 0
	resolve(message, options) {
		if (this.completed) return;
		this.channel.send(message, options);
		this.setStatus(0);
	}

	// Complete the command with an error message and an erroneous exit status
	reject(message, status = 1, options) {
		if (this.completed) return;
		this.channel.send(message, options);
		if (status < 1) this.logger.warn('Rejecting with success status');
		this.setStatus(status);
	}

	// Set the command status
	setStatus(newStatus) {
		if (typeof newStatus !== 'number' || newStatus < -3 || newStatus > 4) {
			this.logger.warn(`Command message received an invalid status ${newStatus}`);
			return;
		}
		if (this.completed) {
			this.logger.warn(oneline`Attempt to change status of completed command message
			(status ${this._status})
			to ${newStatus}`);
			return;
		}
		if (newStatus === -2) {
			this.logger.warn(`Attempt to change status of command message (status ${this._status}) back to -2`);
			return;
		}
		this._status = newStatus;
	}

	// Get the status
	getStatus() {
		return this._status;
	}

	// Parse a command from the message's content
	_parseCommand(prefix) {
		// Remove the command prefix
		const content = this.content.substr(this.content.match(prefix)[1].length).split(' ');
		const commandName = content.shift().toLowerCase();

		// Get the command from the registry
		const command = this.commandHandler.commands.has(commandName) ?
			this.commandHandler.commands.get(commandName) :
			this.commandHandler.commands.find(e => e.aliases.includes(commandName));
		if (!command) return this.setStatus(-3);

		switch (command.registryType) {
			case 0:
				this.setStatus(-1);
				this.command = command;
				break;
			case 1:
				// Handle command groups here
				break;
		}
	}

	/*
	 * Shortcuts because I'm lazy
	 */
	get author() { return this.message.author; }
	get channel() { return this.message.channel; }
	get completed() { return this._status >= 0; }
	get content() { return this.message.content; }
	get failed() { return this._status > 0; }
	get guild() { return this.message.guild; }
	get passed() { return this._status === 0; }
	get say() { return this.message.channel.send; }
}

module.exports = CommandMessage;
