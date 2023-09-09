const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const {
	getAvailableProductService,
	getProductDetailService,
} = require('../Service/EcomService');

const app = express();
const port = 5501;

app.use(express.static(path.join(__dirname, 'views')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
	res.render('index');
});

app.get('/getProducts', async (req, res) => {
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

app.get('/productDetail', (req, res) => {
	res.render('product_detail', { product: req.product });
});

app.get('/product/:productId', async (req, res) => {
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

app.listen(port, () => {
	console.log(`App listening  on port ${port}`);
});
