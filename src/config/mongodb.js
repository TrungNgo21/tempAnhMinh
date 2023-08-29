const mongodb = require('mongodb');
const { MongoClient } = require('mongodb');

//uri for local mongodb
const uri = 'mongodb://127.0.0.1:27017/';
const getClient = (uri) => {
    return new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
};

async function listDatabases(client) {
    databasesList = await client.db().admin().listDatabases();
    console.log('Databases:');
    databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
}

async function createAuthentication(client) {
    await client.db().admin().command({
        createRole: 'readwrite',
    });
    console.log('here');
}

async function main() {
    const client = getClient(uri);

    try {
        await client.connect();
        await createAuthentication(client);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);
