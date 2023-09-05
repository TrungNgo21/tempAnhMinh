const getMySqlConn = require('../../config/sql/Connector');

async function createProduct(user, productId, volume) {
    const conn = await getMySqlConn(user);
    const sql = `insert into product (id, volume) value ('${productId}', '${volume}')`;

    const [rows, fields] = await conn.execute(sql);
    await conn.end();
    return rows.affectedRows;
}

try {
    const result = createProduct('root', 'test 3', '20');
    result.then((r) => {
        console.log(r);
    });
} catch (e) {
    console.log(e);
}
