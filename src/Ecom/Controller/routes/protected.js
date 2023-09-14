const express = require('express');
const router = express.Router();
const {
	getAvailableProductService,
	getProductDetailService,
	addToCartService,
	getCartService,
	removeCartService,
} = require('../../Service/EcomService');
const {
	authenticateTokenService,
} = require('../../Service/AuthenticationService');
const ejs = require('ejs');
const path = require('path');

router.get('/', authenticateTokenService, async (req, res) => {
	try {
		const token = req.query.token;
		let response = await getAvailableProductService();
		const products = response.message;
		if (!response.err) {
			res.status(200).render('index', {
				products: products,
				token: token,
			});
		} else {
			res.status(500);
		}
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
	// res.render('index', {});
});

router.get('/productDetail', authenticateTokenService, async (req, res) => {
	try {
		const productId = req.query.productId;
		const product = await getProductDetailService({
			id: productId,
		});
		if (!product.err) {
			console.log(product);
			res.render('product_detail', { product: product.message });
		} else {
			res.status(400).send(product.message);
		}
	} catch (e) {
		console.error(e.message);
	}
	// res.render(, { product: req.product });
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

router.get('/cart', authenticateTokenService, async (req, res) => {
	try {
		const token = req.query.token;
		const products = await getCartService({
			token: token,
		});
		if (!products.err) {
			res.render('cart', {
				products: products.message.array,
				token: token,
			});
		} else {
			res.status(400).send(products.message);
		}
	} catch (e) {
		console.error(e.message);
	}
});

router.get('/removeCart', authenticateTokenService, async (req, res) => {
	try {
		const result = await removeCartService({
			token: req.query.token,
			productId: req.query.productId,
		});
		if (result.err) {
			res.send({ err: true });
		} else {
			res.send({ err: false });
		}
	} catch (e) {
		console.error(e.message);
	}
});

router.post('/makepurchase', authenticateTokenService, async (req, res) => {
	try {
		const result = await makePurchaseService({
			token: req.query.token,
			cart: req.body.cart,
		});
	} catch (e) {
		console.error(e.message);
	}
});

module.exports = router;
