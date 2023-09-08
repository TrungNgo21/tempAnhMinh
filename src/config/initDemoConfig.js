const { initMongoDB } = require('./mongodb/config');
const { populateData } = require('./PopulateDemo');
async function main() {
	try {
		await initMongoDB();
		await populateData();
	} catch (e) {
		console.error('Error occured', e);
	}
}

main();
