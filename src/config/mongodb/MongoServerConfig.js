/*
 * Script file to run within mongosh using load() function.
 * Setup users and role for the local mongodb. The server instance should be reloaded with --auth option
 * */

conn = Mongo();
db = conn.getDB('admin');

try {
    db.dropUser('root');
} catch (e) {}

db.createUser({
    user: 'root',
    pwd: 'JAAyBD9v7d9B8Y76', // or cleartext password
    roles: [
        { role: 'userAdminAnyDatabase', db: 'admin' },
        { role: 'readWriteAnyDatabase', db: 'admin' },
        { role: 'root' },
    ],
});

try {
    db.dropUser('whadmin');
} catch (e) {}

db.createUser({
    user: 'whadmin',
    pwd: 'CnSNL2Dw50Hd9gui',
    roles: [{ role: 'readWrite', db: 'application' }],
});

try {
    db.dropUser('customer');
} catch (e) {}

db.createUser({
    user: 'customer',
    pwd: 'vVlOlqte0giTh1IQ',
    roles: [{ role: 'read', db: 'application' }],
});

try {
    db.dropRole('staffRole');
} catch (e) {}

db.createRole({
    role: 'staffRole',
    privileges: [
        { resource: { db: 'application', collection: 'product' }, actions: ['insert', 'update', 'find'] },
        { resource: { db: 'application', collection: 'category' }, actions: ['find'] },
    ],
    roles: [{ role: 'read', db: 'application' }],
});

try {
    db.dropUser('staff');
} catch (e) {}

db.createUser({
    user: 'staff',
    pwd: 'vVlOlqte0giTh1IQ',
    roles: ['staffRole'],
});

db = conn.getDB('application');

db.adminCommand({ shutdown: 1 });
