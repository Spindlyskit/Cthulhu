// Eval runs the given javascript code
// This must be owner only as eval is insecure
const util = require('util');
const discord = require('discord.js');
const tags = require('common-tags');
const Command = require('../Command');

const nl = '!!NL!!';
const nlPattern = new RegExp(nl, 'g');

class EvalCommand extends Command {
	constructor(client) {
		super(client, 'eval', {
			description: 'Executes JavaScript code',
			module: 'util',
			ownerOnly: true,
			aliases: ['~'],
			examples: ['eval 1 + 2 // 3', 'eval msg.author.tag // user#0000'],
			args: [
				{
					name: 'script',
					type: 'string',
				},
			],
		});

		this.lastResult = null;
	}

	run(msg, args) {
		// Make a bunch of helpers
		/* eslint-disable no-unused-vars */
		const message = msg.message;
		const client = msg.client;
		const lastResult = this.lastResult;
		const doReply = val => {
			if (val instanceof Error) {
				msg.reject(`Callback error: \`${val}\``, 4);
			} else {
				const result = this.makeResultMessages(val, process.hrtime(this.hrStart));
				if (Array.isArray(result)) {
					for (const item of result) msg.say(item);
					msg.setStatus(0); // Mark as resolved
				} else {
					msg.resolve(result);
				}
			}
		};
		/* eslint-enable no-unused-vars */

		// Run the code and measure its execution time
		let hrDiff;
		try {
			const hrStart = process.hrtime();
			this.lastResult = eval(args.script);
			hrDiff = process.hrtime(hrStart);
		} catch (err) {
			return msg.reject(`Error while evaluating: \`${err}\``, 4);
		}

		// Prepare for callback time and respond
		this.hrStart = process.hrtime();
		const result = this.makeResultMessages(this.lastResult, hrDiff, args.script);
		if (Array.isArray(result)) {
			result.map(item => msg.say(item));
			return msg.setStatus(0);
		} else {
			return msg.resolve(result);
		}
	}

	makeResultMessages(result, hrDiff, input = null) {
		const inspected = util.inspect(result, { depth: 0 })
			.replace(nlPattern, '\n')
			.replace(this.sensitivePattern, '--snip--');
		const split = inspected.split('\n');
		const last = inspected.length - 1;
		const prependPart = inspected[0] !== '{' && inspected[0] !== '[' && inspected[0] !== '\'' ? split[0] : inspected[0];
		const appendPart = inspected[last] !== '}' && inspected[last] !== ']' && inspected[last] !== '\'' ?
			split[split.length - 1] :
			inspected[last];
		const prepend = `\`\`\`javascript\n${prependPart}\n`;
		const append = `\n${appendPart}\n\`\`\``;
		if (input) {
			return discord.splitMessage(tags.stripIndents`
				*Executed in ${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ''}${hrDiff[1] / 1000000}ms.*
				\`\`\`javascript
				${inspected}
				\`\`\`
			`, { maxLength: 1900, prepend, append });
		} else {
			return discord.splitMessage(tags.stripIndents`
				*Callback executed after ${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ''}${hrDiff[1] / 1000000}ms.*
				\`\`\`javascript
				${inspected}
				\`\`\`
			`, { maxLength: 1900, prepend, append });
		}
	}

	get sensitivePattern() {
		if (!this._sensitivePattern) {
			const client = this.client;
			let pattern = '';
			if (client.token) pattern += client.token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
			Object.defineProperty(this, '_sensitivePattern', { value: new RegExp(pattern, 'gi') });
		}
		return this._sensitivePattern;
	}
}

module.exports = EvalCommand;

