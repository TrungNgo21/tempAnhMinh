const { getAvailableProductMySql, insertProductMySql } = require('../../Repository/MySqlRepo');
const { AvailableProdDTO, InsertProductDTO } = require('../../DTO/Product');
const { getAllProductMongo, insertProductMongo, insertCategoryMongo } = require('../../Repository/MongodbRepo');
const { EcomProdList } = require('../../DTO/ProdListDTO');
const { InsertCateDTO } = require('../../DTO/Category');
async function getAvailableProductService() {
    try {
        const ids = await getAvailableProductMySql('root');

        const productIds = new AvailableProdDTO(ids.message);

        const result = await getAllProductMongo('whadmin', productIds.getIds());
        const returnDTO = new EcomProdList(result.message);

        return { err: false, message: returnDTO.getList() };
    } catch (e) {
        return { err: true, message: e.message };
    }
}

async function insertProductService(mapObject) {
    const insertDTO = new InsertProductDTO(
        mapObject.name,
        mapObject.brand,
        mapObject.price,
        mapObject.dimension,
        mapObject.color,
        mapObject.category,
        mapObject.attribute,
        mapObject.pAttribute
    );
    try {
        const mongoResult = await insertProductMongo('whadmin', insertDTO);
        let id;
        if (!mongoResult.err) id = mongoResult.message.toString();

        await insertProductMySql('root', insertDTO.getInsertMySqlDTO(id));
        return { err: false, message: id };
    } catch (e) {
        return { err: true, message: e.message };
    }
}

module.exports = { getAvailableProductService: getAvailableProductService };

// let pCateId;
// let cateId;
// Promise.resolve()
//     .then(async () => {
//         const cate = new InsertCateDTO('test cate 1', null, [{ name: 'attribute 1' }, { name: 'attribute 2' }]);
//         let result = await insertCategoryMongo('whadmin', cate);
//         pCateId = result.message;
//     })
//     .then(async () => {
//         const cate = new InsertCateDTO('test cate 2', pCateId, [{ name: 'attribute 3' }, { name: 'attribute 4' }]);
//         let result = await insertCategoryMongo('whadmin', cate);
//         cateId = result.message;
//     })
//     .then(async () => {
//         const test = {
//             name: 'test product 1',
//             brand: 'test brand 1',
//             price: 10000,
//             dimension: {
//                 width: 3,
//                 height: 1,
//                 length: 1,
//             },
//             color: 'blue',
//             category: pCateId,
//             attribute: [
//                 { name: 'attribute 1', value: 'test attribute' },
//                 { name: 'attribute 2', value: 'test child attribute' },
//             ],
//             pAttribute: [],
//         };
//         console.log(await insertProductService(test));
//     })
//     .then(async () => {
//         const test = {
//             name: 'test product 2',
//             brand: 'test brand 2',
//             price: 20000,
//             dimension: {
//                 width: 1,
//                 height: 2,
//                 length: 2,
//             },
//             color: 'red',
//             category: cateId,
//             attribute: [
//                 { name: 'attribute 3', value: 'test child attribute' },
//                 { name: 'attribute 4', value: 'test other child attribute' },
//             ],
//             pAttribute: [
//                 { name: 'attribute 1', value: 'test parent attribute' },
//                 { name: 'attribute 2', value: 'test other parent attribute' },
//             ],
//         };
//         console.log(await insertProductService(test));
//     });
