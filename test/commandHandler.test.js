// This file contains test for src/command-handler
// It is difficult to test commands themselves so most tests here will test string parsing and the registry
import test from 'ava';
const CommandHandler = require('../src/command-handler/CommandHandler');
const ArgumentString = require('../src/command-handler/ArgumentString');
const Logger = require('../src/Logger');

// Create a minial fake client to test without connecting to discord
const clientSpoof = {
	user: {
		id: '1234567890',
	},
	logger: new Logger('[Client Spoof]'),
};

clientSpoof.commandHandler = new CommandHandler(clientSpoof);
const commandHandler = clientSpoof.commandHandler;

// We use say becuase it is very simple so the msg spoof can be minimal
// More CommandMessage tests should be added in the future
test('Registers defualt say command', t => {
	t.is(commandHandler.commands.has('say'), false);
	commandHandler.loadDefaults();
	t.is(commandHandler.commands.has('say'), true);
	const sayCommand = commandHandler.commands.get('say');
	t.is(sayCommand.name, 'say');
	t.is(sayCommand.display, 'Say');
	t.is(sayCommand.args.length, 1);
	const commandMessageSpoof = {
		resolve: text => t.is(text, 'Hello'),
	};
	sayCommand.run(commandMessageSpoof, { text: 'Hello' });
});

test('Prefix matches commands', t => {
	const matchGlobalPrefix = str =>
		str.match(commandHandler.globalPrefix);
	t.is(matchGlobalPrefix('!prefix args')[0],
		'!prefix');
	t.is(matchGlobalPrefix('<@!1234567890> mention args')[0],
		'<@!1234567890> mention');
	t.is(matchGlobalPrefix('no prefix'),
		null);
});

const argumentMessageSpoof = {
	commandHandler,
	reject: () => null,
};
const commandArgs = [
	{ label: 'a1', type: 'string' },
	{ label: 'a2', type: 'integer' },
	{ label: 'a3', type: 'string' },
	{ label: 'a4', type: 'string' },
];
const argString = new ArgumentString(argumentMessageSpoof, 'these 42 "a few" arguments', commandArgs);

test('Args split correctly', t => {
	const split = argString._args;
	t.is(split[0], 'these');
	t.is(split[1], '42');
	t.is(split[2], 'a few');
	t.is(split[3], 'arguments');
});

