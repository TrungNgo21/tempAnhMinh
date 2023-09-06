const getMongoConn = require('../config/mongodb/Connector');
const { InsertCateDTO, UpdateCateDTO } = require('../DTO/Category');
const { InsertProductDTO, UpdateProductDTO } = require('../DTO/Product');
const mongoose = require('mongoose');

async function insertCategory(user, insertCateDTO) {
    const conn = await getMongoConn(user);
    let pId;
    if (insertCateDTO.getParentId() != null) pId = new mongoose.Types.ObjectId(insertCateDTO.getParentId());
    else pId = null;
    try {
        const vResult = await conn.cate.validateUpdate(insertCateDTO, conn.product);
        if (!vResult.valid) return { err: true, message: 'categories contain products', id: vResult.id };
        const category = new conn.cate({
            _id: new mongoose.Types.ObjectId(),
            name: insertCateDTO.getName(),
            parentId: pId,
            attribute: insertCateDTO.getAttribute(),
        });
        if (insertCateDTO.getParentId() != null) {
            console.log(insertCateDTO.getParentId().toString());
            console.log(category.parentId.toString());
        }

        await category.save();

        // const result = await conn.cate
        //     .findOneAndUpdate(
        //         { name: insertCateDTO.getName(), parentId: insertCateDTO.getParentId() },
        //         {
        //             name: insertCateDTO.getName(),
        //             parentId: insertCateDTO.getParentId(),
        //             attribute: insertCateDTO.getAttribute(),
        //         },
        //         { upsert: true, new: true }
        //     )
        //     .lean()
        //     .exec();

        return { message: category._id, err: false };
    } catch (e) {
        return { err: true, message: e.message };
    } finally {
        await conn.conn.close();
    }
}

async function updateCategory(user, updateCateDTO) {
    const conn = await getMongoConn(user);

    try {
        const vResult = await conn.cate.validateUpdate(updateCateDTO, conn.product);
        if (!vResult.valid) return { err: true, message: 'categories contain products', id: vResult.id };

        const result = await conn.cate
            .findOneAndUpdate(
                { _id: updateCateDTO.getId() },
                {
                    name: updateCateDTO.getName(),
                    parentId: updateCateDTO.getParentId(),
                    attribute: updateCateDTO.getAttribute(),
                },
                { upsert: true, new: true }
            )
            .lean()
            .exec();
        return { message: result._id, err: false };
    } catch (e) {
        return { err: true, message: e.message };
    } finally {
        await conn.conn.close();
    }
}

async function deleteCategory(user, updateCateDTO) {
    const conn = await getMongoConn(user);

    try {
        const vResult = await conn.cate.validateDelete(updateCateDTO.getId(), conn.product);
        if (!vResult.valid && vResult.id == null) return { err: true, message: 'category not found' };
        else if (!vResult.valid && vResult.id != null)
            return { err: true, message: 'this category contain child category' };
        else {
            const result = await conn.cate.deleteOne({ _id: vResult.id }).lean().exec();
            return { err: false, message: result.deletedCount };
        }
    } catch (e) {
        return { err: true, message: e.message };
    } finally {
        await conn.conn.close();
    }
}

async function getAllCate(user) {
    const conn = await getMongoConn(user);

    try {
        const result = await conn.cate.find().sort({ name: 1 }).lean().exec();
        return { message: JSON.stringify(result), err: false };
    } catch (e) {
        return { err: true, message: e.message };
    } finally {
        await conn.conn.close();
    }
}

async function getAllProduct(user, listId) {
    const conn = await getMongoConn(user);
    try {
        const result = await conn.product
            .find({ _id: { $in: listId } })
            .sort({ name: 1 })
            .lean()
            .exec();
        return { err: false, message: result };
    } catch (e) {
        return { err: true, message: e.message };
    } finally {
        await conn.conn.close();
    }
}

async function insertProduct(user, insertProdDTO) {
    const conn = await getMongoConn(user);

    try {
        const valid = await conn.product.validateInsert(insertProdDTO, conn.cate);
        if (!valid) return { err: true, message: 'product attribute not match with category' };

        const result = await conn.product
            .findOneAndUpdate(
                {
                    name: insertProdDTO.getName(),
                    brand: insertProdDTO.getBrand(),
                    category: insertProdDTO.getCategory(),
                },
                {
                    name: insertProdDTO.getName(),
                    brand: insertProdDTO.getBrand(),
                    price: insertProdDTO.getPrice(),
                    dimension: insertProdDTO.getDimension(),
                    color: insertProdDTO.getColor(),
                    category: insertProdDTO.getCategory(),
                    attribute: insertProdDTO.getAttribute(),
                    pAttribute: insertProdDTO.getParentAttribute(),
                },
                { upsert: true, new: true }
            )
            .lean()
            .exec();

        return { message: result._id.toString(), err: false };
    } catch (e) {
        return { err: true, message: e.message };
    } finally {
        await conn.conn.close();
    }
}

async function UpdateProduct(user, updateProdDTO) {
    const conn = await getMongoConn(user);

    try {
        const valid = await conn.product.validateInsert(updateProdDTO, conn.cate);
        if (!valid) return { err: true, message: 'product attribute not match with category' };

        const result = await conn.product
            .findOneAndUpdate(
                { _id: updateProdDTO.getId() },
                {
                    name: updateProdDTO.getName(),
                    brand: updateProdDTO.getBrand(),
                    price: updateProdDTO.getPrice(),
                    dimension: updateProdDTO.getDimension(),
                    color: updateProdDTO.getColor(),
                    category: updateProdDTO.getCategory(),
                    attribute: updateProdDTO.getAttribute(),
                    pAttribute: updateProdDTO.getParentAttribute(),
                },
                { upsert: true, new: true }
            )
            .lean()
            .exec();

        return { message: result._id, err: false };
    } catch (e) {
        return { err: true, message: e.message };
    } finally {
        await conn.conn.close();
    }
}

module.exports = {
    getAllProductMongo: getAllProduct,
    UpdateProductMongo: UpdateProduct,
    insertProductMongo: insertProduct,
    getAllCateMongo: getAllCate,
    deleteCategoryMongo: deleteCategory,
    updateCategoryMongo: updateCategory,
    insertCategoryMongo: insertCategory,
};
//
// let pCateId = '64f847dd79ea0f06a1dc235c';
// let cateId = '64f847dd79ea0f06a1dc236c';
// Promise.resolve()
//
// .then(async () => {
//     const product = new InsertProductDTO(
//         'test product 1',
//         'test brand 1',
//         10000,
//         {
//             width: 1,
//             height: 1,
//             length: 2,
//         },
//         'blue',
//         pCateId,
//         [
//             { name: 'attribute 1', value: 'some attribute' },
//             { name: 'attribute 2', value: 'some other attribute' },
//         ],
//         null
//     );
//     console.log(await insertProduct('whadmin', product));
// })
// .then(async () => {
//     const product = new InsertProductDTO(
//         'test product 2',
//         'test brand 2',
//         20000,
//         {
//             width: 3,
//             height: 1,
//             length: 1,
//         },
//         'red',
//         cateId,
//         [
//             { name: 'attribute 3', value: 'test child attribute' },
//             { name: 'attribute 4', value: 'test other child attribute' },
//         ],
//         [
//             { name: 'attribute 1', value: 'test parent attribute' },
//             { name: 'attribute 2', value: 'test other parent attribute' },
//         ]
//     );
//     console.log(await insertProduct('whadmin', product));
// });
// .then(async () => {
//     const product = new UpdateProductDTO(
//         '64f84d9479ea0f06a1dc27d1',
//         'test product 2',
//         'test brand 2',
//         10000,
//         {
//             width: 3,
//             height: 1,
//             length: 1,
//         },
//         'red',
//         '64f847dd79ea0f06a1dc236c',
//         [
//             { name: 'attribute 3', value: 'test child attribute' },
//             { name: 'attribute 4', value: 'test other child attribute' },
//         ],
//         [
//             { name: 'attribute 1', value: 'test parent attribute' },
//             { name: 'attribute 2', value: 'test other parent attribute' },
//         ]
//     );
//     console.log(await insertProduct('whadmin', product));
// });
