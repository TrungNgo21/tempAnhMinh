/*
 * Script file to run within mongosh using load() function.
 * Setup users and role for the local mongodb. The server instance should be reloaded with --auth option
 * */
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const { MongoClient } = require('mongodb');
const os = require('os');
const fs = require('fs');

const [
	url,
	createRootCommand,
	createWhadminCommand,
	createStaffCommand,
	createCustomerCommand,
	createStaffRoleCommand,
] = [
	'mongodb://127.0.0.1:27017',
	{
		createUser: 'root',
		pwd: 'JAAyBD9v7d9B8Y76',
		roles: [{ role: 'root', db: 'admin' }],
	},
	{
		createUser: 'whadmin',
		pwd: 'CnSNL2Dw50Hd9gui',
		roles: [
			{
				role: 'readWrite',
				db: 'application',
				collection: 'categories',
			},
			{ role: 'read', db: 'application', collection: 'products' },
		],
	},
	{
		createUser: 'staff',
		pwd: 'vVlOlqte0giTh1IQ',
		roles: ['staffRole'],
	},
	{
		createUser: 'customer',
		pwd: 'vVlOlqte0giTh1IQ',
		roles: [{ role: 'read', db: 'application' }],
	},
	{
		createRole: 'staffRole',
		privileges: [
			{
				resource: { db: 'application', collection: 'products' },
				actions: ['insert', 'update', 'find'],
			},
			{
				resource: {
					db: 'application',
					collection: 'categories',
				},
				actions: ['find'],
			},
		],
		roles: [],
	},
];

async function initMongoDBConfig() {
	const conn = new MongoClient(url, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
	try {
		await conn.connect();

		console.log('Connected to MongoDB server');

		let db = conn.db('admin');

		const removeResult = await db.command({ dropAllUsersFromDatabase: 1 });
		console.log(`Removed ${removeResult.n} users`);
		try {
			await db.command({ dropRole: 'staffRole' });
			console.log('Removed staffRole');
		} catch (e) {
			console.log(e.message);
		}

		await db.command(createStaffRoleCommand);
		console.log('Created staffRole');

		await db.command(createRootCommand);
		await db.command(createWhadminCommand);
		await db.command(createStaffCommand);
		await db.command(createCustomerCommand);
		console.log('Created user: root, whadmin, staff, customer');

		db = conn.db('application');
		try {
			await db.dropCollection('categories');
			await db.dropCollection('products');
		} catch (e) {
			console.log('collections doesnt exist');
		}
	} catch (e) {
		console.error('An error occurred:', e);
	} finally {
		if (!!conn) {
			await conn.close();
		}
	}
}

async function readConfigFile(configFile, encoding = 'utf8') {
	return new Promise((resolve, reject) => {
		fs.readFile(configFile, encoding, (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
}

async function writeConfigFile(configFile, finalConfig, encoding = 'utf8') {
	return new Promise((resolve, reject) => {
		fs.writeFile(configFile, finalConfig, encoding, (err) => {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
}

async function updateMongoDBConfig() {
	try {
		const platform = os.platform();
		let configFile;
		if (platform === 'win32') {
			configFile = 'C:/Program Files/MongoDB/Server/7.0/bin/mongod.cfg';
		} else {
			configFile = '/usr/local/etc/mongod.conf';
		}
		const data = await readConfigFile(configFile, 'utf8');

		const updateConfig = data.replace(
			/(\s*)#?(\s*)security:(\s*)/,
			'$1security:\n  authorization: enabled\n'
		);

		await writeConfigFile(configFile, updateConfig, 'utf8');
		console.log('Access control enabled');
	} catch (e) {
		console.error(`Error updating MongoDB configuration: ${e.message}`);
	}
}

async function stopMongoDB() {
	try {
		const platform = os.platform();
		let restartCommand;

		console.log('stopping MongoDB');
		if (platform === 'win32') {
			const { stdout, stderr } = await exec(
				'powershell -Command "Start-Process -Wait -FilePath PowerShell -ArgumentList \'Stop-Service -Name MongoDB\' -Verb RunAs"'
			);
			if (stderr) {
				console.log(`Error stop MongoDB: ${stderr}`);
				return;
			}
			console.log(`MongoDB stop status: ${stdout}`);
		} else {
			const { stdout, stderr } = await exec('brew services stop mongod');
			if (stderr) {
				console.log(`Error stop MongoDB: ${stderr}`);
				return;
			}
			console.log(`MongoDB stop status: ${stdout}`);
		}
	} catch (e) {
		console.log(`Error executing the stop command: ${e}`);
	}
}

async function startMongoDB() {
	const platform = os.platform();
	console.log('Starting MongoDB');
	try {
		if (platform === 'win32') {
			const { stdout, stderr } = await exec(
				'powershell -Command "Start-Process -Wait -FilePath PowerShell -ArgumentList \'Start-Service -Name MongoDB\' -Verb RunAs"'
			);
			if (stderr) {
				console.log(`Error start MongoDB: ${stderr}`);
				return;
			}
			console.log(`MongoDB start status: ${stdout}`);
		} else {
			const { stdout, stderr } = await exec('brew services start mongod');
			if (stderr) {
				console.log(`Error start MongoDB: ${stderr}`);
				return;
			}
			console.log(`MongoDB start status: ${stdout}`);
		}
	} catch (e) {
		console.log(`Error executing the start command: ${e}`);
	}
}

async function main() {
	try {
		await initMongoDBConfig();
		await stopMongoDB();
		await updateMongoDBConfig();
		await startMongoDB();
	} catch (e) {
		console.error('Error occured', e);
	}
}

module.exports = { initMongoDB: main };
