const mongodb = require('mongodb');
const { MongoClient } = require('mongodb');

//uri for local mongodb
function getMongoClient(u, p) {
    const username = encodeURIComponent(u);
    const password = encodeURIComponent(p);

    const url = '127.0.0.1:27017';
    const authMechanism = 'SCRAM-SHA-256';

    const uri = `mongodb://${username}:${password}@${url}/?authMechanism=${authMechanism}`;

    return new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}

module.exports = { getMongoClient };
