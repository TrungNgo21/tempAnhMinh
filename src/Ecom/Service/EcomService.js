const {
	getAvailableProductMySql,
	getProductInventory,
	getUser,
	updateUserCart,
} = require('../../Repository/MySqlRepo');
const { AvailableProdDTO } = require('../../DTO/Product');
const {
	getAllProductMongo,
	getProduct,
} = require('../../Repository/MongodbRepo');
const { ECOMProdList, ProductDetail } = require('../ReturnDTO/ReturnDTO');
const { restartTries } = require('concurrently/src/defaults');

async function getAvailableProductService() {
	try {
		const ids = await getAvailableProductMySql('root');

		const productIds = new AvailableProdDTO(ids.message);

		const result = await getAllProductMongo(
			'customer',
			productIds.getIds()
		);
		const returnDTO = new ECOMProdList(result.message);

		return { err: false, message: returnDTO.getList() };
	} catch (e) {
		return { err: true, message: e.message };
	}
}

async function getProductDetailService(mapObject) {
	try {
		const mongoReturn = await getProduct('customer', mapObject.id);
		const mysqlReturn = await getProductInventory('customer', mapObject.id);
		if (!mongoReturn.err && !mysqlReturn.err) {
			const returnDTO = new ProductDetail(
				mongoReturn.message,
				mysqlReturn.message
			);
			return { err: false, message: returnDTO.getProductDetail() };
		} else if (mongoReturn.err) {
			return { err: true, message: mongoReturn.message };
		} else {
			return { err: true, message: mysqlReturn.message };
		}
	} catch (e) {
		return { err: true, message: e.message };
	}
}
async function addToCartService(mapObject) {
	try {
		const user = await getUser(mapObject.token);
		if (user.err) {
			return { err: true };
		}
		const mysqlReturn = await updateUserCart(
			user.id,
			mapObject.productId,
			mapObject.quantity
		);
		if (mysqlReturn.err) {
			return { err: true };
		}
		return { err: false };
	} catch (e) {
		console.error(e.message);
	}
}

module.exports = {
	getAvailableProductService: getAvailableProductService,
	getProductDetailService: getProductDetailService,
	addToCartService: addToCartService,
};
