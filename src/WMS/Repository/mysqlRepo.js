const getMySqlConn = require('../../config/sql/Connector');
const { MongoProductDTO, MySqlUpdateProductDTO, TransferDTO, UpdateInventoryDTO } = require('../DTO/ProductDTO');
const { UpdateWarehouseDTO } = require('../DTO/WarehouseDTO');

const TYPE = {
    SELECT: true,
    ELSE: false,
};

const CHOICE = {
    CREATE_WH: 0,
    UPDATE_WH: 1,
    CREATE_PROD: 2,
    UPDATE_PROD: 3,
    UPDATE_INV: 4,
    TRANSFER_INV: 5,
};

async function createProduct(user, updateProductDTO) {
    const result = await query_wrapper(
        user,
        `insert into product (id, volume) value ('${updateProductDTO.getId()}', '${updateProductDTO.getVolume()}')`
    );
    if (result.affectedRows != 1) return { err: true, message: 'create product fail' };
    return { err: false, message: 'create product success', id: result[0].id };
}

async function updateProduct(user, updateProductDTO) {
    const result = await query_wrapper(
        user,
        `update product set volume = ${updateProductDTO.getVolume()} where id = '${updateProductDTO.getId()}'`
    );
    if (result.affectedRows != 1) return { err: true, message: 'update fail' };
    return { err: false, message: 'update success' };
}

async function transferInvent(user, transferDTO) {
    const result = await query_wrapper(
        user,
        `call product_transfer('${transferDTO.getId()}', ${transferDTO.getFromWh()}, ${transferDTO.getToWh()}, ${transferDTO.getQty()});`
    );
    if (result[0].err) return { err: true, message: 'target inventory is full' };
    return { err: false, message: 'transfer success' };
}

async function createWarehouse(user, updateWhDTO) {
    const result = await query_wrapper(
        user,
        `insert into warehouse (name, address, city, province, volume) value (
                '${updateWhDTO.getName()}', 
                '${updateWhDTO.getAddress()}', 
                '${updateWhDTO.getCity()}', 
                '${updateWhDTO.getProvince()}', 
                ${updateWhDTO.getVolume()})`
    );
    console.log(result);
    if (result.affectedRows != 1) return { err: true, message: 'create warehouse fail' };
    return { err: false, message: 'create warehouse success', id: result.insertId };
}

async function updateWarehouse(user, updateWhDTO) {
    const result = await query_wrapper(
        user,
        `update warehouse 
                set 
                    name = '${updateWhDTO.getName()}' and 
                    address = '${updateWhDTO.getAddress()}' and
                    city = '${updateWhDTO.getCity()}' and 
                    province = '${updateWhDTO.getProvince()}' and 
                    volume = ${updateWhDTO.getVolume()}
                where id = ${updateWhDTO.getId()}`
    );
}

async function updateInventory(user, updateInventoryDTO) {
    const result = await query_wrapper(
        user,
        `call product_purchase_order (${updateInventoryDTO.getId()}, ${updateInventoryDTO.getQty()})`,
        TYPE.ELSE
    );
    return { err: result[0].err, message: result[0].message };
}

async function query_wrapper(user, sql) {
    const conn = await getMySqlConn(user);
    const [result] = await conn.execute(sql);
    await conn.end();
    return result;
}

async function test(user, aDTO, choice) {
    switch (choice) {
        case CHOICE.CREATE_WH:
            return createWarehouse(user, aDTO);
        case CHOICE.UPDATE_WH:
            return updateWarehouse(user, aDTO);
        case CHOICE.CREATE_PROD:
            return createProduct(user, aDTO);
        case CHOICE.UPDATE_PROD:
            return updateProduct(user, aDTO);
        case CHOICE.TRANSFER_INV:
            return transferInvent(user, aDTO);
        case CHOICE.UPDATE_INV:
            return updateInventory(user, aDTO);
    }
}

let updateWHDTO = new UpdateWarehouseDTO(13, 'test warehouse 2', '124 test', 'test city', 'test province', 20000);

test('root', updateWHDTO, CHOICE.UPDATE_WH).then((r) => {
    console.log(r);
});
