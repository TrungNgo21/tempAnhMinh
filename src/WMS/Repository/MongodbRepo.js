const getMongoConn = require('../../config/mongodb/Connector');
const updateCateDTO = require('../DTO/UpdateCateDTO');
const updateProductDTO = require('../DTO/UpdateProductDTO');
async function updateCategory(user, cateDTO) {
    const conn = await getMongoConn(user);

    try {
        const vResult = await conn.cate.validateUpdate(cateDTO, conn.product);
        if (!vResult.valid) return { error: true, message: 'categories contain products', id: vResult.id };

        const result = await conn.cate
            .findOneAndUpdate(
                { name: cateDTO.getName(), parentId: cateDTO.getParentId() },
                { name: cateDTO.getName(), parentId: cateDTO.getParentId(), attribute: cateDTO.getAttribute() },
                { upsert: true, new: true }
            )
            .lean()
            .exec();

        if (result._id == null) return { id: vResult._id, error: false };
        return { id: result._id, error: false };
    } catch (e) {
        return { error: true, message: e.message };
    } finally {
        await conn.conn.close();
    }
}

async function deleteCategory(user, cateId) {
    const conn = await getMongoConn(user);

    try {
        const vResult = await conn.cate.validateDelete(cateId, conn.product);
        if (!vResult.valid && vResult.id == null) return { error: true, message: 'category not found' };
        else if (!vResult.valid && vResult.id != null)
            return { error: true, message: 'this category contain child category' };
        else {
            const result = await conn.cate.deleteOne({ _id: vResult.id }).lean().exec();
            return { error: false, value: result.deletedCount };
        }
    } catch (e) {
        return { error: true, message: e.message };
    }
}

async function getAllCate(user) {
    const conn = await getMongoConn(user);

    try {
        conn.cate
            .find()
            .sort({ name: 1 })
            .then((result) => {
                return { result: JSON.stringify(result), error: false };
            });
    } catch (e) {
        return { error: true, message: e.message };
    }
}

async function getAllProduct(user) {
    const conn = await getMongoConn(user);

    try {
        conn.product
            .find()
            .sort({ name: 1 })
            .then((ressult) => {
                return { result: JSON.stringify(ressult), error: false };
            });
    } catch (e) {
        return { error: true, message: e.message };
    }
}

async function updateProduct(user, productDTO) {
    const conn = await getMongoConn(user);

    try {
        const valid = await conn.product.validateUpdate(productDTO, conn.cate);
        if (!valid) return { error: true, message: 'product attribute not match with category' };

        const result = await conn.product
            .findOneAndUpdate(
                { name: productDTO.getName(), brand: productDTO.getBrand(), category: productDTO.getCategory() },
                {
                    name: productDTO.getName(),
                    brand: productDTO.getBrand(),
                    price: productDTO.getPrice(),
                    dimension: productDTO.getDimension(),
                    color: productDTO.getColor(),
                    category: productDTO.getCategory(),
                    attribute: productDTO.getAttribute(),
                    parentAttribute: productDTO.getParentAttribute(),
                },
                { upsert: true }
            )
            .lean()
            .exec();

        return { result: result, error: false };
    } catch (e) {
        return { error: true, message: e.message };
    }
}

let testCate = new updateCateDTO('test cate 1', null, [{ name: 'attribute 1' }, { name: 'attribute 2' }]);

updateCategory('whadmin', testCate).then((result) => {
    const testRefCate = new updateCateDTO('test cate 2', result.id, [{ name: 'attribute 3' }, { name: 'attribute 4' }]);

    const testProduct = new updateProductDTO(
        'test product 1',
        'test brand 1',
        10000,
        {
            width: 0.4,
            height: 2,
            length: 0.5,
        },
        'blue',
        result.id,
        [
            { name: 'attribute 1', value: 'some attribute' },
            { name: 'attribute 2', value: 'some other attribute' },
        ],
        []
    );

    updateCategory('whadmin', testRefCate).then((e) => {
        deleteCategory('whadmin', result.id)
            .then((e) => {
                console.log(e.message);
            })
            .then((e) => {
                updateProduct('whadmin', testProduct).then();
            });
    });
});

testCate = new updateCateDTO('test cate 3', null, [{ name: 'attribute 1' }, { name: 'attribute 2' }]);

updateCategory('whadmin', testCate).then((r) => {
    deleteCategory('whadmin', r.id).then();
});

const result = getAllProduct('staff').then((i) => {
    console.log(i);
});
