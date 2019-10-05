// Main entry point into the bot
// This will start the bot and the dashboard
require('colors');
const Logger = require('./Logger');

const masterLogger = new Logger('[Cthulhu]'.trap.bold.red);
masterLogger.info('Starting');
require('./bot/index');

