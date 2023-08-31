const { getMongoConn } = require('../../config/Connector');
const updateCateDTO = require('../DTO/UpdateCateDTO.js');
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
                return { result: JSON.stringify(result), error: false };
            });
    } catch (e) {
        return { error: true, message: e.message };
    }
}

async function updateProduct(user, productDTO) {
    const conn = await getMongoConn(user);

    try {
        conn.product.validateUpdate(productDTO, conn.cate).then((valid) => {
            if (!valid) return { error: true, message: 'product attribute not match with category' };

            const result = conn.product
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
        });
    } catch (e) {
        return { error: true, message: e.message };
    }
}

const testCate = new updateCateDTO('test cate 1', null, [{ name: 'attribute 1' }, { name: 'attribute 2' }]);

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
            { name: 'attribute 3', value: 'some other attributes' },
        ],
        []
    );

    updateCategory('whadmin', testRefCate).then((e) => {
        console.log('update here');

        updateProduct('staff', testProduct).then();
    });
});

// const result = getAllProduct('staff').then((i) => {
//     console.log(i);
// });
