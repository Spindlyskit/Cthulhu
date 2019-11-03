// This file provides functions for creating discord messages
const { stripIndents } = require('common-tags');
const util = require('./index');

// Re-export for compatibility
// New files should require from here
exports.cleanMentions = util.cleanMentions;

// Escape the given characters in a string
const escape = (text, ...chars) => {
	// Matches characters to escape
	const replaceRegex = new RegExp(`[${chars.join('')}]`, 'g');
	return text.replace(replaceRegex, '\\$&');
};
exports.escape = escape;

// Basic discord chat components
const format = {
	bold: text => `**${escape(text, '*')}**`,
	code: text => `\`${escape(text, '`')}\``,
	italic: text => `*${escape(text, '*')}*`,
	spoiler: text => `||${escape(text, '|')}||`,
	underline: text => `__${escape(text, '_')}__`,
	codeblock: (text, lang = '') => stripIndents`\`\`\`${lang}
	${text}
	\`\`\``
};
exports.format = format;

// Displays a user in the format @name#discrim (`id`)
exports.expandedTag = user => `@${user.tag} (${format.code(user.id)})`;

