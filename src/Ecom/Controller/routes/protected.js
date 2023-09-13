const express = require('express');
const router = express.Router();
const {
	getAvailableProductService,
	getProductDetailService,
	addToCartService,
} = require('../../Service/EcomService');
const {
	authenticateTokenService,
} = require('../../Service/AuthenticationService');
// eslint-disable-next-line new-cap

router.get('/', authenticateTokenService, (req, res) => {
	console.log(req.session.valid);
	res.render('index');
});

router.get('/getProducts', async (req, res) => {
	try {
		let response = await getAvailableProductService();
		const products = response.message;
		if (!response.err) {
			res.status(200).send({ products: products });
		} else {
			res.status(500);
		}
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

router.get('/productDetail', (req, res) => {
	res.render('product_detail', { product: req.product });
});

router.get('/product/:productId', async (req, res) => {
	try {
		const productId = req.params.productId;
		const product = await getProductDetailService({
			id: productId,
		});
		if (!product.err) {
			res.send({ product: product.message });
		} else {
			res.status(400).send(product.message);
		}
	} catch (e) {
		console.error(e.message);
	}
});

router.post('/product/addCart', async (req, res) => {
	try {
		const productId = req.body.productId;
		const quantity = req.body.quantity;
		const token = req.body.token;

		const response = await addToCartService({
			token: token,
			productId: productId,
			quantity,
		});
	} catch (e) {
		console.error(e.message);
	}
});

module.exports = router;
