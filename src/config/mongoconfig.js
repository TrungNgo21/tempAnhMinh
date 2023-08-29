conn = Mongo();
db = conn.getDB('admin');

db.createUser({
    user: 'root',
    pwd: 'JAAyBD9v7d9B8Y76', // or cleartext password
    roles: [
        { role: 'userAdminAnyDatabase', db: 'admin' },
        { role: 'readWriteAnyDatabase', db: 'admin' },
    ],
});

db.createUser({
    user: 'whadmin',
    pwd: 'CnSNL2Dw50Hd9gui',
    roles: [{ role: 'readWrite', db: 'application' }],
});

db.createUser({
    user: 'customer',
    pwd: 'vVlOlqte0giTh1IQ',
    roles: [{ role: 'read', db: 'application' }],
});

db.createRole({
    role: 'staffRole',
    privileges: [
        { resource: { db: 'application', collection: 'product' }, actions: ['insert, update', 'find'] },
        { resource: { db: 'application', collection: 'category' }, actions: ['find'] },
    ],
});

db.createUser({
    user: 'staff',
    pwd: 'vVlOlqte0giTh1IQ',
    roles: [{ role: 'staffRole', db: 'application' }],
});

db.adminCommand({ shutdown: 1 });
