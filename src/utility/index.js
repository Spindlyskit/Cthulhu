// This file provides helpers methods used everywhere
const path = require('path');
const fs = require('fs');

// Prevent mentions in a message by inserting a zero width character after @
module.exports.cleanMentions = text => {
	if (typeof text === 'string') return text.replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`);
	else return text;
};

// Check if a string is a discord id
module.exports.isId = id => /^[0-9]*$/.test(id);

// Format a string in title case
module.exports.toTitleCase = str => str.replace(
	/\w\S*/g,
	txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
);

// Prefix a word with the correct indefinite article
module.exports.indefiniteArticle = str => `${str.match('^[aieouAIEOU].*') ? 'an' : 'a'} ${str}`;

// Check if a number is a valid level
module.exports.isLevel = i => i >= 0 && i <= 100;

// Recursively read a directory
const read = (root, files, prefix) => {
	prefix = prefix || '';
	files = files || [];

	const dir = path.join(root, prefix);
	if (!fs.existsSync(dir)) return files;
	if (fs.statSync(dir).isDirectory()) {
		fs.readdirSync(dir)
			.forEach(name => {
				read(root, files, path.join(prefix, name));
			});
	} else { files.push(prefix); }

	return files;
};
module.exports.read = read;

