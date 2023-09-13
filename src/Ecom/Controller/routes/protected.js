const express = require('express');
const router = express.Router();
const {
	getAvailableProductService,
	getProductDetailService,
	addToCartService,
	getCartService,
} = require('../../Service/EcomService');
const {
	authenticateTokenService,
} = require('../../Service/AuthenticationService');
// eslint-disable-next-line new-cap

router.get('/', authenticateTokenService, (req, res) => {
	res.render('index');
});

router.get('/getProducts', authenticateTokenService, async (req, res) => {
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

router.get('/productDetail', authenticateTokenService, (req, res) => {
	res.render('product_detail', { product: req.product });
});

router.get('/product', authenticateTokenService, async (req, res) => {
	try {
		const productId = req.query.productId;
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

router.post('/product/addCart', authenticateTokenService, async (req, res) => {
	try {
		const productId = req.body.productId;
		const quantity = parseInt(req.body.quantity, 10);
		const token = req.query.token;

		const response = await addToCartService({
			token: token,
			productId: productId,
			quantity: quantity,
		});
		console.log(response);
	} catch (e) {
		console.error(e.message);
	}
});

router.get('/cart', authenticateTokenService, (req, res) => {
	res.render('cart');
});

router.get('/getCart', authenticateTokenService, async (req, res) => {
	try {
		const token = req.query.token;
		const product = await getCartService({
			token: token,
		});
		if (!product.err) {
			res.send({ products: product.message });
		} else {
			res.status(400).send(product.message);
		}
	} catch (e) {
		console.error(e.message);
	}
});

module.exports = router;
