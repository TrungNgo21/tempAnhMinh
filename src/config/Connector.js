const { mongoose } = require('mongoose');

export function getMongoConn(u, p) {
    const username = encodeURIComponent(u);
    const password = encodeURIComponent(p);

    const url = '127.0.0.1:27017';
    const authMechanism = 'SCRAM-SHA-256';

    const uri = `mongodb://${username}:${password}@${url}/?authMechanism=${authMechanism}`;
    return mongoose.connect(uri);
}
