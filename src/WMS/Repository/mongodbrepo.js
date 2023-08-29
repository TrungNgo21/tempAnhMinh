const mongo = require('./Connector');
const CateDTO = require('../DTO/CateDTO');
const cred = {
    whadmin: 'CnSNL2Dw50Hd9gui',
    staff: 'vVlOlqte0giTh1IQ',
    customer: 'vVlOlqte0giTh1IQ',
    test: 'test',
};

const testCate = new CateDTO.CateDTO(
    'test cate',
    null,
    [
        { name: 'attribute 1', value: '1' },
        { name: 'attribute 2', value: '2' },
    ],
    []
);

async function getAllCate(user) {
    try {
        const client = mongo.getMongoClient(user, cred[user]);
        const db = client.db('application');
        const categories = await db.collection('category').find();
        for await (const doc of categories) {
            console.log(doc);
        }
        await client.close();
        return { result: categories.toArray(), error: false };
    } catch (e) {
        console.error(e.message);
        return { error: true, message: e.message };
    }
}

async function addCategory(user, cateDTO) {
    try {
        const client = mongo.getMongoClient(user, cred[user]);
        const db = client.db('application');
        const doc = {
            name: cateDTO.getName(),
            parentId: cateDTO.getParentId(),
            attribute: cateDTO.getAttribute(),
            parentAttribute: cateDTO.getParentAttribute(),
        };
        const result = await db.collection('category').insertOne(doc);
        await client.close();
        return { result: result.insertedId, error: false };
    } catch (e) {
        console.log(e.message);
        return { error: true, message: e.message };
    }
}

console.log(addCategory('whadmin', testCate));

console.log(getAllCate('whadmin'));
