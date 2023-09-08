const mongoose = require('mongoose');
const { categoryModel } = require('./schema/category');
const { productModel } = require('./schema/product');

const cred = {
	whadmin: 'CnSNL2Dw50Hd9gui',
	staff: 'vVlOlqte0giTh1IQ',
	customer: 'vVlOlqte0giTh1IQ',
	test: 'test',
};

async function getMongoConn(user) {
	const username = encodeURIComponent(user);
	const password = encodeURIComponent(cred[user]);

	const url = '127.0.0.1:27017';
	const authMechanism = 'SCRAM-SHA-256';

	const uri = `mongodb://${url}/`;
	const options = {
		user: username,
		pass: password,
		authMechanism: authMechanism,
		dbName: 'application',
		autoIndex: true,
	};

	const conn = await mongoose.createConnection(uri, options).asPromise();

	const cate = categoryModel(conn);
	const product = productModel(conn);

	return { conn: conn, cate: cate, product: product };
}

module.exports = getMongoConn;
