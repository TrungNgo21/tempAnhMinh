const {
	getAvailableProductMySql,
	getProductInventory,
	getUser,
	updateUserCart,
	getUserCart,
	removeUserCart,
	makeTransaction,
	getUserRole,
} = require('../../Repository/MySqlRepo');
const { AvailableProdDTO } = require('../../DTO/Product');
const {
	getAllProductMongo,
	getProduct,
	getCartProduct,
	getAllCateMongo,
	getCateMongo,
} = require('../../Repository/MongodbRepo');
const {
	ECOMProdList,
	ProductDetail,
	CartProduct,
	CategoryDTO,
} = require('../ReturnDTO/ReturnDTO');

async function getAvailableProductService(mapObject) {
	try {
		const ids = await getAvailableProductMySql('root');

		const productIds = new AvailableProdDTO(ids.message);

		let cateSelect = {};
		if (mapObject.category) {
			const cateSelectReturn = await getCateMongo(
				'customer',
				mapObject.category
			);
			cateSelect.name = cateSelectReturn.message.name;
			cateSelect.id = cateSelectReturn.message._id;
		}

		const productReturn = await getAllProductMongo(
			'customer',
			productIds.getIds(),
			mapObject.category,
			mapObject.searchString
		);
		const productsDTO = new ECOMProdList(productReturn.message);
		const categoryReturn = await getAllCateMongo('customer');
		const cateDTO = new CategoryDTO(categoryReturn.message);
		return {
			err: false,
			products: productsDTO.getList(),
			categories: cateDTO.generateOutput(),
			categorySelect: cateSelect,
		};
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

async function getCartService(mapObject) {
	try {
		const user = await getUser(mapObject.token);
		if (user.err) {
			return { err: true };
		}
		const mysqlReturn = await getUserCart(user.id);
		const mysqlProducts = mysqlReturn.products;
		const ids = mysqlProducts.map((product) => product.productId);

		const mongoReturn = await getCartProduct(ids);
		const mongoProducts = mongoReturn.message;

		const cartDTO = new CartProduct(mongoProducts, mysqlProducts);
		return { err: false, message: cartDTO };
	} catch (e) {
		console.error(e.message);
	}
}

async function removeCartService(mapObject) {
	try {
		const user = await getUser(mapObject.token);
		if (user.err) {
			return { err: true };
		}
		const mysqlReturn = await removeUserCart(user.id, mapObject.productId);
		if (mysqlReturn.err) {
			return { err: true };
		}
		return { err: false };
	} catch (e) {
		console.error(e.message);
	}
}

async function makePurchaseService(mapObject) {
	try {
		const user = await getUser(mapObject.token);
		if (user.err) {
			return { err: true };
		}
		const cartReturn = await getCartService(mapObject);
		const cart = cartReturn.message.array;
		const mysqlReturn = await makeTransaction(user.id, cart);
		return mysqlReturn;
	} catch (e) {
		console.error(e.message);
	}
}

module.exports = {
	getAvailableProductService: getAvailableProductService,
	getProductDetailService: getProductDetailService,
	addToCartService: addToCartService,
	getCartService: getCartService,
	removeCartService: removeCartService,
	makePurchaseService: makePurchaseService,
};
