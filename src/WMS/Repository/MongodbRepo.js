const getMongoConn = require('../../config/Connector');
const mongoose = require('mongoose');
const CateDTO = require('../DTO/CateDTO.js');
const cred = {
    whadmin: 'CnSNL2Dw50Hd9gui',
    staff: 'vVlOlqte0giTh1IQ',
    customer: 'vVlOlqte0giTh1IQ',
    test: 'test',
};

const testCate = new CateDTO(
    'test cate 3',
    null,
    [
        { name: 'attribute 1', value: '1' },
        { name: 'attribute 2', value: '2' },
    ],
    []
);

async function updateCategory(user, cateDTO) {
    const conn = getMongoConn('whadmin', 'CnSNL2Dw50Hd9gui');
}

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
        const result = await db.collection('category').updateOne({ name: doc.name }, { $set: doc }, { upsert: true });

        await client.close();
        return { result: result.insertedId, error: false };
    } catch (e) {
        console.log(e.message);
        return { error: true, message: e.message };
    }
}

console.log(addCategory('whadmin', testCate).result);

console.log(getAllCate('whadmin').result);
