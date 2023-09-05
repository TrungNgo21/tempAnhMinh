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

async function createProduct(user, createProductDTO) {
    const result = await query_wrapper(
        user,
        `insert into product (id, volume) value ('${createProductDTO.getId()}', '${createProductDTO.getVolume()}')`
    );
    if (result.affectedRows != 1) return { err: true, message: 'create product fail' };
    return { err: false, message: 'create product success', id: createProductDTO.getId() };
}

async function updateProduct(user, updateProductDTO) {
    const result = await query_wrapper(
        user,
        `update product set volume = ${updateProductDTO.getVolume()} where id = '${updateProductDTO.getId()}'`
    );
    if (result.affectedRows != 1) return { err: true, message: 'update product fail' };
    return { err: false, message: 'update product success', id: updateProductDTO.getId() };
}

async function transferInvent(user, transferDTO) {
    const result = await query_wrapper(
        user,
        `call product_transfer('${transferDTO.getId()}', ${transferDTO.getFromWh()}, ${transferDTO.getToWh()}, ${transferDTO.getQty()});`
    );
    if (result[0].err) return { err: true, message: 'target inventory is full' };
    return { err: false, message: 'transfer success' };
}

async function createWarehouse(user, CreateWhDTO) {
    const result = await query_wrapper(
        user,
        `insert into warehouse (name, address, city, province, volume) value (
                '${CreateWhDTO.getName()}', 
                '${CreateWhDTO.getAddress()}', 
                '${CreateWhDTO.getCity()}', 
                '${CreateWhDTO.getProvince()}', 
                ${CreateWhDTO.getVolume()})`
    );
    if (result.affectedRows != 1) return { err: true, message: 'create warehouse fail' };
    return { err: false, message: 'create warehouse success', id: result.insertId };
}

async function updateWarehouse(user, updateWhDTO) {
    const result = await query_wrapper(
        user,
        `update warehouse 
                set 
                    name = '${updateWhDTO.getName()}', 
                    address = '${updateWhDTO.getAddress()}',
                    city = '${updateWhDTO.getCity()}', 
                    province = '${updateWhDTO.getProvince()}', 
                    volume = ${updateWhDTO.getVolume()}
                where id = ${updateWhDTO.getId()}`
    );
    if (result.affectedRows != 1) return { err: true, message: 'update warehouse fail' };
    return { err: false, message: 'update warehouse success', id: updateWhDTO.getId() };
}

async function updateInventory(user, updateInventoryDTO) {
    const result = await query_wrapper(
        user,
        `call product_purchase_order ('${updateInventoryDTO.getId()}', ${updateInventoryDTO.getQty()})`
    );
    if (result[0].err) return { err: true, message: 'inventory exceed all warehouse capacity' };
    return { err: false, message: 'PO success' };
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

const createWHDTO = new UpdateWarehouseDTO(null, 'test warehouse', '123 test', 'test city', 'test province', 20000);
const updateWHDTO = new UpdateWarehouseDTO(
    3,
    'test update warehouse',
    'update address test',
    'update city test',
    'update province test',
    30000
);
const createProdDTO = new MySqlUpdateProductDTO('test prod', 4);
const updateProdDTO = new MySqlUpdateProductDTO('test prod', 5);
const transferDTO = new TransferDTO('shoes', 2, 1, 100);
const updateInventoryDTO = new UpdateInventoryDTO('test prod', 10);

const testArray = [
    test('root', createWHDTO, CHOICE.CREATE_WH),
    test('root', updateWHDTO, CHOICE.UPDATE_WH),
    test('root', createProdDTO, CHOICE.CREATE_PROD),
    test('root', updateProdDTO, CHOICE.UPDATE_PROD),
    test('root', transferDTO, CHOICE.TRANSFER_INV),
    test('root', updateInventoryDTO, CHOICE.UPDATE_INV),
];
Promise.resolve()
    .then(async () => console.log(await testArray[0]))
    .then(async () => console.log(await testArray[1]))
    .then(async () => console.log(await testArray[2]))
    .then(async () => console.log(await testArray[3]))
    .then(async () => console.log(await testArray[4]))
    .then(async () => console.log(await testArray[5]));
