// Registry is a ultility class for bulk requiring arbitrary files
// It's main use is for requiring all commands and arguments from a directory
// Registry items must have a constructor that takes only a client option
// The instances must have a name attibute to become their mapping key
const path = require('path');
const { Collection } = require('discord.js');
const util = require('../utility');

class Registry extends Collection {
	constructor(client, holds, postRegister = null) {
		super();
		this.client = client;

		// The type of object this registry can hold
		// All entries must extend this object
		this.holds = holds;

		// A fuction that takes a name and an instace of holds
		// Run after a new object is registered
		// Optional
		this.postRegister = postRegister;
	}

	// Add an object into the registery
	// Returns a boolean representing the success of the action
	registerObject(ObjectClass) {
		// Create a new instance and add it to the registry
		let object;
		try {
			object = new ObjectClass(this.client);
		} catch (e) {
			this.client.logger.error('A registry attempted to register an object but an error occured', e);
			return false;
		}
		if (!(object instanceof this.holds) || !object.name) {
			this.client.logger.warn('A registry attempted to load invalid class');
			return false;
		}
		const name = object.name;
		this.set(name, object);
		if (this.postRegister) this.postRegister(name, object);
		return true;
	}

	// Load a file and add it into the registry
	registerFile(file) {
		const ObjectClass = require(file);
		if (!ObjectClass || !this.registerObject(ObjectClass)) {
			this.client.logger.warn(`A registry attempted to load invalid class from file ${file}`);
			return false;
		}
		this.client.logger.debug(`Registered ${file}`);
		return true;
	}

	// Load all files in directory
	registerDirectory(dir) {
		const content = util.read(dir);
		if (!content) {
			this.client.logger.warn(`A registry tried to load invalid directory ${dir}`);
			return false;
		}
		const result = content.every(e => this.registerFile(path.join(dir, e)));
		if (!result) {
			this.client.logger.warn(`A registry failed to register some files in ${dir}`);
			return false;
		}
		this.client.logger.debug(`Registered ${dir}`);
		return true;
	}
}

module.exports = Registry;

