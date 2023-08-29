conn = Mongo();
db = conn.getDB('admin');

db.dropUser('root');
db.createUser({
    user: 'root',
    pwd: 'JAAyBD9v7d9B8Y76', // or cleartext password
    roles: [
        { role: 'userAdminAnyDatabase', db: 'admin' },
        { role: 'readWriteAnyDatabase', db: 'admin' },
    ],
});

db.dropUser('whadmin');
db.createUser({
    user: 'whadmin',
    pwd: 'CnSNL2Dw50Hd9gui',
    roles: [{ role: 'readWrite', db: 'application' }],
});

db.dropUser('customer');
db.createUser({
    user: 'customer',
    pwd: 'vVlOlqte0giTh1IQ',
    roles: [{ role: 'read', db: 'application' }],
});

try {
    db.dropRole('staffRole');
} catch (e) {
    print(e);
}
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
} catch (e) {
    print(e);
}
db.createUser({
    user: 'staff',
    pwd: 'vVlOlqte0giTh1IQ',
    roles: ['staffRole'],
});

db.adminCommand({ shutdown: 1 });
