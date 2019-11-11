// Ping gets the bots ping to discord
const { oneLine } = require('common-tags');
const Command = require('../Command');

module.exports = class PingCommand extends Command {
	constructor(client) {
		super(client, 'ping', {
			description: 'Checks the bot\'s ping to the Discord server.',
			module: 'util',
			level: 0,
			throttling: {
				usages: 5,
				duration: 10,
			},
		});
	}

	async run(msg) {
		const { message } = msg;
		const pingMsg = await msg.say('Pinging...');
		await pingMsg.edit(oneLine`
			${message.channel.type !== 'dm' ? `${message.author},` : ''}
			Pong! The message round-trip took ${(pingMsg.editedTimestamp ||
			pingMsg.createdTimestamp) - (message.editedTimestamp || message.createdTimestamp)}ms.

			${this.client.ws.ping ? `The heartbeat ping is ${Math.round(this.client.ws.ping)}ms.` : ''}
		`);
		msg.setStatus(0);
	}
};

